/* eslint-disable prettier/prettier */

export interface IUser {
    id: string;
    password: string;
    sign_in_type: string;
    last_login: Date;
    last_login_Ip: string;
    last_login_location: object;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    about: string;
    gender: string;
    role: any;
    status: string;
    app_user_Id: any;
    x_api_key: string;
    refresh_token: string;
    category_Id: string;
    permissions?: string[];
    // This field is needed here because the frontend sends it during account creation
    owner_id?: string;
    organization?: any;
    org_branch_id?: string;
}