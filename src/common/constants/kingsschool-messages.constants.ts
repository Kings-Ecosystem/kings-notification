/* eslint-disable prettier/prettier */
import { IResetPassord } from 'src/models/interfaces/forgetPassword.interface';
import { IPersonnel } from 'src/models/interfaces/personnel.interface';
import { IUser } from 'src/models/interfaces/user.interface';

// @TODO - USE SCHOOL INFO TO CUSTOMIZE THIS EMAIL TEMPLATES

export const KingsSchoolEmailTemplates = {
  adminAccount: (data: Partial<IUser>) => {
    return `Dear <strong>${data.username}</strong>,<br><br>

    We're thrilled to welcome you to the Kingsschool Software community!<br><br>
    Your admin account has been successfully created, and you're now ready to manage ${data?.school?.name} with ease.<br><br>
    
    Kingsschool empowers you to streamline educational processes, and boost productivity.<br><br>
    As an admin, you have access to powerful features like:<br><br>
    
    => <strong>Schhol Grading/Reports management:</strong> Manage learning grading system and report card generation<br><br>

    => <strong>License management:</strong> Allocate and track software licenses, ensuring optimal resource utilization.<br><br>

    => <strong>Security management:</strong> Implement security policies, control access, and monitor activity for complete data protection.<br><br>
    
    => <strong>Reporting & analytics:</strong> Gain valuable insights into software usage and user activity through detailed reports.<br><br>
    
    If you have any questions or need assistance, please don't hesitate to reach out to our dedicated support team.<br>
    They are available 24/7 via phone, email, or live chat.<br><br><br>
    
    We're confident that Kingsschool Software will be a valuable asset to your Institution.<br><br>
    We look forward to supporting you on your journey towards efficient school management.<br><br>
    
    Sincerely,<br>
    
    <strong>The Kingsschool Software Team</strong><br>
    `;
  },
  personnelAccount: (data: IPersonnel) => {
    return `
Dear <strong>${data.username}</strong>,<br><br>

We are thrilled to welcome you to Kingsschool Software!<br><br>
Your account has been successfully created, and we are excited to have you on board.<br><br>
As an essential member of the <strong>${data.school.name}</strong> team, you play a crucial role in ensuring the smooth operation and success of the Institution.<br><br>

Here are a few key details to help you get started:<br><br>

<strong>Username:</strong> ${data.username}<br>
<strong>Password:</strong> ${data.password}<br><br>

<strong>Getting Started:</strong><br><br>

=> <strong>Login:</strong> Visit <a href="https://sms.ksoftinc.com/auth/login">kingsschool</a> and enter your username and password to log in for the first time.<br><br>


=> <strong>Explore Features:</strong> Familiarize yourself with the various features and functionalities available to you within Kingsschool Software.<br>
   Our user-friendly interface is designed to streamline your tasks and enhance efficiency.<br><br>

=> <strong>Support and Resources:</strong> Should you have any questions or encounter any issues, our support team is here to assist you.<br>
   You can reach out to <strong>${data.school.contact_email ?? "kingsschoolsoft@gmail.com"}</strong> or <strong>${data.school.contact_phone ?? "(+237) 675 455 860"}</strong> for prompt assistance.<br><br>

=> <strong>Updates and Announcements:</strong> Stay informed about the latest updates, enhancements, and announcements by regularly checking our <a href="https://ksoftinc.com">website</a>.<br><br>

Sincerely,<br>
    
<strong>The Kingsschool Software Team</strong>
`;
  },
  resetPassword: (payload: IResetPassord) => {
    return `
    Hi <strong>${payload.username}</strong>,<br><br>

    We received a request to reset your password for your Kingsschool account.<br><br>
    If you did not request this password reset, please disregard this email.<br><br>

    To reset your password, please click the following link:<br><br><br>

    <a href="${payload.url}">Reset Password</a><br><br>
    
    This link will expire in ${payload.expiry} hours.<br><br><br>

    If you cannot access the link above, please copy and paste it into your web browser.<br><br>

    Once you click on the link, you will be taken to a page where you can create a new password for your account.<br><br>
    Please choose a strong password that you do not use for any other accounts.<br><br>

    If you have any questions or need further assistance, please do not hesitate to contact us at <strong>${payload?.companyEmail ?? "kingsschoolsoft@gmail.com"}</strong>.<br><br>

    Sincerely,<br>

    <strong>The Kingsschool Software Team</strong>
    `
  }
};
