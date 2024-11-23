/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { INotification } from 'src/models/interfaces/notification.interface';
import { RedisService } from 'src/cache/redis/redis.service';
import * as nodemailer from "nodemailer";
import { KingsSchoolEmailTemplates } from 'src/common/constants/kingsschool-messages.constants';
import { KingsCorpEmailTemplates } from 'src/common/constants/kingscorp-messages.constants';

@Injectable()
export class NotificationsService {

    private transporter: any;

    constructor() {
        this.transporter = nodemailer.createTransport({
            service: process.env.MAIL_SERVICE ?? 'gmail',
            auth: {
                user: process.env.MAIL_SERVICE_USER ?? 'kingssoft@example.com',
                pass: process.env.MAIL_SERVICE_PASS ?? 'password'
            }
        });
    }

    async push(notification: INotification) {
        const cache = RedisService.client;
        const res = await cache.set("message", JSON.stringify(notification));
        return res;
    }

    async pull(): Promise<INotification> {
        const cache = RedisService.client;
        const res = await cache.get("message");
        return JSON.parse(res);
    }

    async sendEmail(payload: any) {
        const email = getMessageDestination(payload)
        const mailOptions = {
            from: process.env.MAIL_SERVICE_AUTHOR ?? 'kingssoft@example.com',
            to: email.to,
            subject: email.subject,
            html: email.text
        };

        const result = this.transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
                return false;
            } else {
                console.log('Email sent: ' + info.response);
                return true;
            }
        });

        return result;
    }
}
function getMessageDestination(payload: any) {
    const templates = {
        kingsschoolAdminAccount: KingsSchoolEmailTemplates.adminAccount,
        kingsschoolPersonnelAccount: KingsSchoolEmailTemplates.personnelAccount,
        kingsschoolResetPassword: KingsSchoolEmailTemplates.resetPassword,
        kingsschoolUserAccountInfoUpdate: KingsSchoolEmailTemplates.userAccountInfoUpdate,
        kingsschoolPasswordResetSuccess: KingsSchoolEmailTemplates.passwordResetSuccess,
        kingscorpAdminAccount: KingsCorpEmailTemplates.adminAccount,
        kingscorpPersonnelAccount: KingsCorpEmailTemplates.personnelAccount,
        kingscorpResetPassword: KingsCorpEmailTemplates.resetPassword,  
    }
    return {
        to: payload.to,
        subject: payload.subject,
        text: templates[payload.template](payload),
    }
}

