import { Schema, model } from "mongoose";

export interface ItemBill {
  name: string;
  description: string;
  amount: number;
}

export interface LeaseBillInput {
  leaseID: string;
  dateLimit: string;
  contractID: string;
  status?: "pending" | "paid" | "overdue";
  items: [ItemBill];
  fee: number;
  total: number;
  iva?: number;
  subtotal: number;
  discount?: number;
  link?: string;
  latePayment?: number;
}

export interface LeaseBillDocument extends LeaseBillInput {
  createdAt: Date;
  updatedAt: Date;
}

const LeaseBillSchema = new Schema(
  {
    leaseID: {
      type: String,
      required: [true, "The leaseID is required"],
    },
    dateLimit: {
      type: String,
      required: [true, "The dateLimit is required"],
    },
    contractID: {
      type: String,
      required: [true, "The contractID is required"],
    },
    items: {
      type: [
        {
          name: String,
          description: String,
          amount: Number,
        },
      ],
      required: [true, "The items is required"],
    },
    fee: {
      type: Number,
      required: [true, "The fee is required"],
    },
    status: {
      type: String,
      default: "pending",
    },
    total: {
      type: Number,
      required: [true, "The total is required"],
    },
    iva: {
      type: Number,
    },
    subtotal: {
      type: Number,
    },
    discount: {
      type: Number,
      required: [true, "The subtotal is required"],
    },
    link: {
      type: String,
    },
    latePayment: {
      type: Number,
    },
  },
  { timestamps: true },
);

LeaseBillSchema.methods.transform = function() {
  const transformed = {
    id: this.id,
    leaseID: this.leaseID,
    dateLimit: this.dateLimit,
    contractID: this.contractID,
    status: this.status,
    items: this.items,
    fee: this.fee,
    total: this.total,
    iva: this.iva,
    subtotal: this.subtotal,
    discount: this.discount,
    link: this.link,
    latePayment: this.latePayment,
  };

  return transformed;
};

export const LeaseBill: any = model("LeaseBill", LeaseBillSchema);
