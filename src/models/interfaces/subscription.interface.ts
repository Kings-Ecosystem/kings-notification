/* eslint-disable prettier/prettier */

import { IBase } from "./base.interface";


export class Subscription extends IBase {
    type: any;
    recurrence_type: any;
    status: any;
    amount_paid: number;
    payment_ref: string;
    payment_method: any;
    discount?: {
        type: any,
        value: number
    }
}
