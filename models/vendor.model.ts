import mongoose, { Schema, Model, Document } from 'mongoose';

export interface IVendor extends Document {
    name: string;
    ownerName: string;
    foodTypes: [string];
    pincode: string;
    address: string;
    phone: string;
    email: string;
    password: string;
    serviceAvailable: boolean;
    coverImages: [string];
    rating: number;
    // food: any
}

const vendorSchema: Schema = new Schema({
    name: { type: String, required: true },
    ownerName: { type: String, required: true },
    foodTypes: { type: [String], required: true },
    pincode: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    serviceAvailable: { type: Boolean, required: true },
    coverImages: { type: [String], required: true },
    rating: { type: Number, required: true },
    // food: {
    //     type: Schema.Types.ObjectId,
    //     ref: 'Food'
    // }
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

const Vendor = mongoose.model<IVendor>('Vendor', vendorSchema);

export { Vendor };