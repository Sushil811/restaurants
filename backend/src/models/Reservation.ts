import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IReservation extends Document {
  user?: mongoose.Types.ObjectId;
  name: string;
  email: string;
  phone: string;
  date: Date;
  time: string;
  guests: number;
  occasion: 'birthday' | 'anniversary' | 'business' | 'romantic' | 'other';
  specialRequests?: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  confirmationCode: string;
  tableNumber?: string;
  notes?: string;
  emailSent: boolean;
  smsSent: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ReservationSchema = new Schema<IReservation>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    date: {
      type: Date,
      required: [true, 'Reservation date is required'],
    },
    time: {
      type: String,
      required: [true, 'Reservation time is required'],
    },
    guests: {
      type: Number,
      required: [true, 'Number of guests is required'],
      min: [1, 'At least 1 guest is required'],
      max: [20, 'Maximum 20 guests allowed'],
    },
    occasion: {
      type: String,
      enum: ['birthday', 'anniversary', 'business', 'romantic', 'other'],
      default: 'other',
    },
    specialRequests: {
      type: String,
      trim: true,
      maxlength: [500, 'Special requests cannot exceed 500 characters'],
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed'],
      default: 'pending',
    },
    confirmationCode: {
      type: String,
      unique: true,
    },
    tableNumber: {
      type: String,
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [1000, 'Notes cannot exceed 1000 characters'],
    },
    emailSent: {
      type: Boolean,
      default: false,
    },
    smsSent: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Auto-generate confirmation code for new reservations
ReservationSchema.pre('save', async function (this: IReservation) {
  if (this.isNew && !this.confirmationCode) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = 'RES-';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    this.confirmationCode = code;
  }
});

ReservationSchema.index({ date: 1, time: 1 });
ReservationSchema.index({ user: 1 });
ReservationSchema.index({ status: 1 });
ReservationSchema.index({ email: 1 });

const Reservation: Model<IReservation> = mongoose.model<IReservation>(
  'Reservation',
  ReservationSchema
);

export default Reservation;
