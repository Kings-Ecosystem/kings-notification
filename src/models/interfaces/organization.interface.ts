/* eslint-disable prettier/prettier */
import { IBase } from "./base.interface";
import { Subscription } from "./subscription.interface";


export class IOrganization extends IBase {
    org_name: string;
    description: string;
    isHeadquaters: boolean
    org_email?: string;
    org_tel?: string;
    file?: string;
    subscription: Subscription
}