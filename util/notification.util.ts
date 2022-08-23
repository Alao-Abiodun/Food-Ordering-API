export const generateOtp =  () => {

    const otp = Math.floor(10000 + Math.random() * 900000); // create a random numbers of 6 digits

    // add 30 minutes to the expiry Date
    const otp_expiry = new Date();
    otp_expiry.setTime(new Date().getTime() + (30 * 60 * 10000));

    return { otp, otp_expiry };
}

export const onRequestOtp =  async (otp: number, toPhoneNumber: string) => {
    const accountSid = '';
    const authToken = '';

    const client = require('twilio')(accountSid, authToken);

    const response = await client.message.create({
        body: `Your OTP is ${otp}`,
        from: '',
        to: toPhoneNumber
    })

    return response;
}