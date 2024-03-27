export interface INotification {
    // id: string;
    // academic_year?: string
    // app_url: string,
    // sender: {
    //     email: string
    // },
    owner: {
        email: string,
        address: string,
        phone: string
    },
    // school_logo: string,
    receipient: {
        name: string,
        email: string,
        profile_picture: string,
        role: string,
        full_name: string,
        password: string
    },
    title: string,
    subject: string,
    message: string,
    created_at: string,
    plesantry: string,

}