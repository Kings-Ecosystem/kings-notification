/* eslint-disable prettier/prettier */
export interface IForgetPassword {
    newPassword: string;
    passwordResetToken: string;
}

export interface IResetPassord {
    url: string;
    expiry: number;
    username: string,
    companyEmail?: string
}

export interface IForgetPassordPayload {
   email:string
}