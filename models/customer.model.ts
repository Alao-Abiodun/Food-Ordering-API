import mongoose, { Schema, Model, Document } from 'mongoose';

export interface ICustomer extends Document {
    firstName: string;
    lastName: string;
    address: string;
    phone: string;
    email: string;
    password: string;
    verified: boolean;
    otp: number;
    otp_expiry: Date;
    lat: number;
    lng: number;
}

const customerSchema: Schema = new Schema({
    firstName: {type: String},
    lastName: { type: String},
    address: { type: String },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    verified: { type: Boolean },
    otp: { type: Number},
    otp_expiry: { type: Date},
    lat: { type: Number},
    lng: { type: Number}
}, {
    toJSON: {
        transform(doc, ret) {
            delete ret.password;
            delete ret.__v;
            delete ret.createdAt,
            delete ret.updatedAt;
        }},
    timestamps: true
})

const Customer = mongoose.model<ICustomer>('Customer', customerSchema);

export { Customer };