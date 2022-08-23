import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IFood extends Document {
    vendor_id:string;
    name: string;
    description: string;
    category: string;
    foodType: string;
    readyTime: number;
    price: number;
    images: [string];
    ratings: number;
}

const FoodSchema: Schema = new Schema({
    vendor_id: { type: String },
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    foodType: { type: String, required: true },
    readyTime: { type: Number, required: true },
    price: { type: Number, required: true },
    images: { type: [String], required: true },
    ratings: { type: Number }
}, {
    toJSON: {
        transform(doc, ret) {
            delete ret.__v;
            delete ret.createdAt,
            delete ret.updatedAt;
        }
    },
    timestamps: true
})

const Food = mongoose.model<IFood>('Food', FoodSchema);

export { Food };