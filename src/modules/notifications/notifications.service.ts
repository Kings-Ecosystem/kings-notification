/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { INotification } from 'src/models/interfaces/notification.interface';
import { RedisService } from 'src/cache/redis/redis.service';
import * as nodemailer from "nodemailer";
import { KingsSchoolEmailTemplates } from 'src/common/constants/kingsschool-messages.constants';
import { KingsCorpEmailTemplates } from 'src/common/constants/kingscorp-messages.constants';
import { Resend } from 'resend';

@Injectable()
export class NotificationsService {

    private transporter: any;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.MAIL_SERVICE ?? 'smtp.gmail.com',
            port: process.env.MAIL_SERVICE_PORT ?? 465,
            secure: false,
            auth: {
                user: process.env.MAIL_SERVICE_USER ?? 'kingssoft@example.com',
                pass: process.env.MAIL_SERVICE_PASS ?? 'password',
            },
            tls: {
                rejectUnauthorized: false
            }
        });
    }

    async push(notification: INotification & { tokens?: string[]; title?: string; body?: string; userId?: number }) {
        const cache = RedisService.client;
        await cache.set("message", JSON.stringify(notification));
        const tokens = notification.tokens?.length
            ? notification.tokens
            : notification.userId
                ? await this.tokensForUser(notification.userId)
                : [];
        if (tokens.length) {
            await this.sendExpoPush(tokens, notification.title || 'Fluide Campus', notification.body || JSON.stringify(notification));
        }
        return { ok: true, sent: tokens.length };
    }

    private async tokensForUser(userId: number): Promise<string[]> {
        try {
            const raw = await RedisService.client.get(`push:tokens:${userId}`);
            return raw ? JSON.parse(raw) : [];
        } catch {
            return [];
        }
    }

    async sendExpoPush(tokens: string[], title: string, body: string) {
        const messages = tokens
            .filter((token) => typeof token === 'string' && token.startsWith('ExponentPushToken'))
            .map((to) => ({ to, title, body, sound: 'default' }));
        if (!messages.length) {
            return;
        }
        await fetch('https://exp.host/--/api/v2/push/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body: JSON.stringify(messages),
        });
    }

    async pull(): Promise<INotification> {
        const cache = RedisService.client;
        const res = await cache.get("message");
        return JSON.parse(res);
    }

    async sendEmail(payload: any) {
        const email = resolveEmailMessage(payload);
        const mailOptions: Record<string, unknown> = {
            from: process.env.MAIL_SERVICE_AUTHOR ?? 'kingssoft@example.com',
            to: email.to,
            subject: email.subject,
            html: email.text,
        };
        if (Array.isArray(payload?.attachments) && payload.attachments.length) {
            mailOptions.attachments = payload.attachments;
        }

        const apiKey = process.env.RESEND_API_KEY?.trim();
        if (!apiKey) {
            await this.transporter.sendMail(mailOptions);
            return;
        }

        const resend = new Resend(apiKey);
        let lastError: Error | undefined;
        for (let attempt = 1; attempt <= 3; attempt++) {
            const { error } = await resend.emails.send(mailOptions as any);
            if (!error) {
                return;
            }
            lastError = new Error(error.message || 'Resend email send failed');
            await new Promise((resolve) => setTimeout(resolve, 500 * Math.pow(2, attempt - 1)));
        }
        throw lastError;
    }
}

const EMAIL_TEMPLATES: Record<string, (data: any) => string> = {
    kingsschoolAdminAccount: KingsSchoolEmailTemplates.adminAccount,
    kingsschoolPersonnelAccount: KingsSchoolEmailTemplates.personnelAccount,
    kingsschoolResetPassword: KingsSchoolEmailTemplates.resetPassword,
    kingsschoolUserAccountInfoUpdate: KingsSchoolEmailTemplates.userAccountInfoUpdate,
    kingsschoolPasswordResetSuccess: KingsSchoolEmailTemplates.passwordResetSuccess,
    kingsschoolPaymentReceipt: (data) => {
        const name = data.learner
            ? `${data.learner.first_name ?? ''} ${data.learner.last_name ?? ''}`.trim()
            : data.student_name || 'parent';
        return `Dear <strong>${name || 'parent'}</strong>,<br><br>
Your payment of <strong>${data.amount ?? data.outstanding_amount ?? ''}</strong> has been recorded.<br>
Receipt number: <strong>${data.receipt_number ?? 'N/A'}</strong>.<br><br>
Sincerely,<br><strong>The Kingsschool Software Team</strong>`;
    },
    feeReminder: (data) => {
        const ctx = data.context || {};
        const name = ctx.student_name || data.student_name || 'parent';
        const amount = ctx.outstanding_amount ?? data.outstanding_amount ?? '';
        const extra = ctx.custom_message || data.custom_message || 'Please clear your outstanding dues.';
        return `Dear <strong>${name}</strong>,<br><br>
This is a reminder that an outstanding balance of <strong>${amount}</strong> remains on the school account.<br><br>
${extra}<br><br>
Sincerely,<br><strong>The Kingsschool Software Team</strong>`;
    },
    kingscorpAdminAccount: KingsCorpEmailTemplates.adminAccount,
    kingscorpPersonnelAccount: (data) =>
        KingsCorpEmailTemplates.personnelAccount(data, data.organization || data.org || {}),
    kingscorpResetPassword: KingsCorpEmailTemplates.resetPassword,
};

export function resolveEmailMessage(payload: any) {
    if (!payload?.to) {
        throw new Error('recipient is required');
    }
    if (payload.html) {
        return {
            to: payload.to,
            subject: payload.subject || 'Notification',
            text: payload.html,
        };
    }
    const render = EMAIL_TEMPLATES[payload.template];
    if (typeof render !== 'function') {
        throw new Error(`unknown email template: ${payload.template ?? '(none)'}`);
    }
    return {
        to: payload.to,
        subject: payload.subject || 'Notification',
        text: render({ ...payload, ...(payload.context || {}) }),
    };
}

