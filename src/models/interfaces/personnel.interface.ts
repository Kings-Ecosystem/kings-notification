/* eslint-disable prettier/prettier */
import { IUser } from "./user.interface";

export interface IPersonnel extends Partial<IUser> {
    owner_id?: string
    org_branch_id?: string
}