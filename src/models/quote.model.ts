import { Schema, model } from "mongoose";

export interface QuoteInput {
  active: boolean;
  admon: number;
  amount: number;
  city: string;
  duration: string;
  fee: number;
  includeAdmon?: boolean;
  state: string;
  tenantEmail: string;
  status: "pending" | "processed" | "abandoned";
  feedback: string;
}

export interface QuoteDocument extends QuoteInput {
  createdAt: Date;
  updatedAt: Date;
}

const QuoteSchema = new Schema(
  {
    active: {
      type: Boolean,
      default: true,
    },
    admon: {
      type: Number,
      default: 0,
    },
    amount: {
      type: Number,
      required: [true, "The amount is required"],
    },
    city: {
      type: String,
      required: [true, "The city is required"],
    },
    duration: {
      type: Number,
      required: [true, "The duration is required"],
    },
    fee: {
      type: Number,
      required: [true, "The fee is required"],
    },
    includeAdmon: {
      type: Boolean,
      default: false,
    },
    state: {
      type: String,
      required: [true, "The state is required"],
    },
    tenantEmail: {
      type: String,
      required: [true, "The tenant email is required"],
    },
    status: {
      type: String,
      default: "pending",
    },
    feedback: {
      type: String,
      default: "",
    },
  },
  { timestamps: true },
);

QuoteSchema.methods.transform = function() {
  const transformed = {
    id: this.id,
    active: this.active,
    admon: this.admon,
    amount: this.amount,
    createdAt: this.createdAt,
    city: this.city,
    duration: this.duration,
    fee: this.fee,
    includeAdmon: this.includeAdmon,
    state: this.state,
    tenantEmail: this.tenantEmail,
    status: this.status,
    feedback: this.feedback,
  };

  return transformed;
};

export const Quote: any = model("Quote", QuoteSchema);
