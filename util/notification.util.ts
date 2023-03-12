import dotenv from 'dotenv';
dotenv.config();

const { ACCOUNT_SID, ACCOUNT_TOKEN, ACCOUNT_PHONE_NUMBER } = process.env;

export const generateOtp =  () => {

    const otp = Math.floor(10000 + Math.random() * 900000); // create a random numbers of 6 digits

    // add 30 minutes to the expiry Date
    const otp_expiry = new Date();
    otp_expiry.setTime(new Date().getTime() + (30 * 60 * 10000));

    return { otp, otp_expiry };
}

export const onRequestOtp =  async (otp: number, toPhoneNumber: string) => {
    const accountSid = ACCOUNT_SID;
    const authToken = ACCOUNT_TOKEN;

    const client = require('twilio')(accountSid, authToken);

    const response = await client.messages.create({
        body: `Your OTP is ${otp}`,
        from: ACCOUNT_PHONE_NUMBER,
        to: `+234${toPhoneNumber}` 
    })

    return response;
}