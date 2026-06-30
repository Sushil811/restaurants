import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ILoyaltyTransaction {
  type: 'earn' | 'redeem';
  points: number;
  description: string;
  orderId?: mongoose.Types.ObjectId;
  createdAt: Date;
}

export interface ILoyaltyPoints extends Document {
  user: mongoose.Types.ObjectId;
  points: number;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  transactions: ILoyaltyTransaction[];
  totalEarned: number;
  totalRedeemed: number;
  updatedAt: Date;
}

const LoyaltyTransactionSchema = new Schema<ILoyaltyTransaction>(
  {
    type: {
      type: String,
      enum: ['earn', 'redeem'],
      required: true,
    },
    points: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    orderId: {
      type: Schema.Types.ObjectId,
      ref: 'Order',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const LoyaltyPointsSchema = new Schema<ILoyaltyPoints>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    points: {
      type: Number,
      default: 0,
      min: 0,
    },
    tier: {
      type: String,
      enum: ['bronze', 'silver', 'gold', 'platinum'],
      default: 'bronze',
    },
    transactions: {
      type: [LoyaltyTransactionSchema],
      default: [],
    },
    totalEarned: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalRedeemed: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: { createdAt: false, updatedAt: true },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Auto-update tier based on total earned points
LoyaltyPointsSchema.pre('save', function (this: ILoyaltyPoints) {
  const total = this.totalEarned;
  if (total >= 10000) {
    this.tier = 'platinum';
  } else if (total >= 5000) {
    this.tier = 'gold';
  } else if (total >= 1000) {
    this.tier = 'silver';
  } else {
    this.tier = 'bronze';
  }
});

const LoyaltyPoints: Model<ILoyaltyPoints> = mongoose.model<ILoyaltyPoints>(
  'LoyaltyPoints',
  LoyaltyPointsSchema
);

export default LoyaltyPoints;
