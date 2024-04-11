import { Schema, model } from "mongoose";

export interface CancellationReasonInput {
  leaseID: string;
  cancellationReason: string;
}

export interface CancellationReasonDocument extends CancellationReasonInput {
  createdAt: Date;
  updatedAt: Date;
}

const CancellationReasonSchema = new Schema(
  {
    leaseID: {
      type: String,
    },
    cancellationReason: {
      type: String,
    },
  },
  { timestamps: true },
);

CancellationReasonSchema.methods.transform = function() {
  const transformed = {
    id: this.id,
    leaseID: this.leaseID,
    cancellationReason: this.cancellationReason,
  };

  return transformed;
};

export const CancellationReason: any = model(
  "CancellationReason",
  CancellationReasonSchema,
);
