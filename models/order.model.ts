import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IOrder extends Document {
    order_id: string;
    vendor_id: string;
    items: [any];
    totalAmount: number;
    orderDate: number;
    paidThrough: string;
    paymentResponse: string;
    orderStatus: string;
    remarks: string;
    delivery_id: string;
    appliedOffer: boolean;
    offerId: string;
    readyTime: number;
}

const orderSchema: Schema = new Schema({
    order_id: {type: String, required: true },
    vendor_id: { type: String, required: true },
    items: [
        {
            food: {type: Schema.Types.ObjectId, ref: 'Food', require: true, },
            unit: {type: Number, require: true}
        }
    ],
    totalAmount: { type: Number },
    orderDate: { type: Date },
    paidThrough: { type: String },
    paymentResponse: { type: String},
    orderStatus: { type: String },
    remarks: {type: String},
    delivery_id: { type: String },
    appliedOffer: { type: Boolean },
    offerId: { type: String},
    readyTime: { type: Number }
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

const Order = mongoose.model<IOrder>('Order', orderSchema);

export { Order };