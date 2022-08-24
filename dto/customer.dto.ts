import { IsEmail, IsEmpty, Length } from 'class-validator';

export class createCustomerDTO {
    @IsEmail()
    email: string;

    @Length(7,11)
    phone: string;

    @Length(6, 16)
    password: string
}

export class createCustomerLoginDTO {
    @IsEmail()
    email: string;

    @Length(6, 16)
    password: string;
}

export interface editCustomerProfile {
    firstName: string;
    lastName: string;
    address: string;
}

export interface customerPayload {
    _id: string;
    email: string;
    verified: boolean;
}