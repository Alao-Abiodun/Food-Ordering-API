import { IsEmail, IsEmpty, Length } from 'class-validator';

export class createCustomerDTO {
    @IsEmail()
    email: string;

    @Length(7,10)
    phone: string;

    @Length(6, 16)
    password: string
}

export interface customerPayload {
    _id: string;
    email: string;
    verified: boolean;
}