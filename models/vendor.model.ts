import mongoose, { Schema, Model, Document } from 'mongoose';

interface IVendor extends Document {
    name: string;
    ownerName: string;
    foodType: [string];
    pincode: string;
    address: string;
    phone: string;
    email: string;
    password: string;
    salt: string;
    serviceAvailable: boolean;
    coverImages: [string];
    rating: number;
    foods: any
}

const vendorSchema: Schema = new Schema<IVendor>({
    name: { type: String, required: true },
    ownerName: { type: String, required: true },
    foodType: { type: [String], required: true },
    pincode: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    salt: { type: String, required: true},
    serviceAvailable: { type: Boolean, required: true },
    coverImages: { type: [String], required: true },
    rating: { type: Number, required: true },
    foods: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Food'
        }
    ]
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