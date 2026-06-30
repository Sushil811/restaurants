import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IOrderItem {
  menuItem: mongoose.Types.ObjectId;
  name: string;
  price: number;
  quantity: number;
  customizations: { name: string; option: string; additionalPrice: number }[];
  image?: string;
}

export interface ITrackingUpdate {
  status: string;
  message: string;
  timestamp: Date;
}

export interface IDeliveryAddress {
  street: string;
  city: string;
  state: string;
  pincode: string;
}

export interface IOrder extends Document {
  orderNumber: string;
  user: mongoose.Types.ObjectId;
  items: IOrderItem[];
  subtotal: number;
  deliveryFee: number;
  tax: number;
  discount: number;
  total: number;
  coupon?: mongoose.Types.ObjectId;
  paymentMethod: 'stripe' | 'cod';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  orderStatus:
    | 'pending'
    | 'confirmed'
    | 'preparing'
    | 'ready'
    | 'out_for_delivery'
    | 'delivered'
    | 'cancelled';
  deliveryAddress: IDeliveryAddress;
  specialInstructions?: string;
  estimatedDelivery?: Date;
  trackingUpdates: ITrackingUpdate[];
  stripePaymentIntentId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>(
  {
    menuItem: {
      type: Schema.Types.ObjectId,
      ref: 'MenuItem',
      required: true,
    },
    name: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1 },
    customizations: [
      {
        name: { type: String },
        option: { type: String },
        additionalPrice: { type: Number, default: 0 },
        _id: false,
      },
    ],
    image: { type: String, default: '' },
  },
  { _id: true }
);

const TrackingUpdateSchema = new Schema<ITrackingUpdate>(
  {
    status: { type: String, required: true },
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: false }
);

const DeliveryAddressSchema = new Schema<IDeliveryAddress>(
  {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
  },
  { _id: false }
);

const OrderSchema = new Schema<IOrder>(
  {
    orderNumber: {
      type: String,
      unique: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
    },
    items: {
      type: [OrderItemSchema],
      required: true,
      validate: {
        validator: (v: IOrderItem[]) => v.length > 0,
        message: 'Order must have at least one item',
      },
    },
    subtotal: { type: Number, required: true, min: 0 },
    deliveryFee: { type: Number, default: 0, min: 0 },
    tax: { type: Number, default: 0, min: 0 },
    discount: { type: Number, default: 0, min: 0 },
    total: { type: Number, required: true, min: 0 },
    coupon: {
      type: Schema.Types.ObjectId,
      ref: 'Coupon',
    },
    paymentMethod: {
      type: String,
      enum: ['stripe', 'cod'],
      required: [true, 'Payment method is required'],
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
    },
    orderStatus: {
      type: String,
      enum: [
        'pending',
        'confirmed',
        'preparing',
        'ready',
        'out_for_delivery',
        'delivered',
        'cancelled',
      ],
      default: 'pending',
    },
    deliveryAddress: {
      type: DeliveryAddressSchema,
      required: [true, 'Delivery address is required'],
    },
    specialInstructions: {
      type: String,
      trim: true,
      maxlength: [500, 'Special instructions cannot exceed 500 characters'],
    },
    estimatedDelivery: { type: Date },
    trackingUpdates: {
      type: [TrackingUpdateSchema],
      default: [],
    },
    stripePaymentIntentId: { type: String },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Auto-generate order number: LUM-000001
OrderSchema.pre('save', async function (this: IOrder) {
  if (this.isNew && !this.orderNumber) {
    try {
      const count = await (this.constructor as Model<IOrder>).countDocuments();
      const padded = String(count + 1).padStart(6, '0');
      this.orderNumber = `LUM-${padded}`;
    } catch (err: any) {
      throw err;
    }
  }
});

OrderSchema.index({ user: 1, createdAt: -1 });
OrderSchema.index({ orderStatus: 1 });
OrderSchema.index({ paymentStatus: 1 });
OrderSchema.index({ createdAt: -1 });

const Order: Model<IOrder> = mongoose.model<IOrder>('Order', OrderSchema);

export default Order;
