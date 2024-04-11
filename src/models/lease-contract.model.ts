import { Schema, model } from "mongoose";

export interface LeaseContractInput {
  leaseID: string;
  link: string;
  finish: string;
  ownerAddress: string;
  ownerCityDocumentExpedition: string;
  ownerDocumentId: number;
  ownerEmail: string;
  ownerFirstName: string;
  ownerLastName: string;
  ownerPhone: string;
  ownerTypeDocument: string;
  start: string;
  status: "open" | "signed" | "cancelled" | "active" | "expired";
  tenantDocumentId: number;
  tenantEmail: string;
  tenantFirstName: string;
  tenantLastName: string;
  tenantPhone: string;
  tenantTypeDocument: string;
  tenantCityDocumentExpedition: string;
  contractSignID: number; // open_id in zapsing
}

export interface LeaseContractDocument extends LeaseContractInput {
  createdAt: Date;
  updatedAt: Date;
}

const LeaseContractSchema = new Schema(
  {
    finish: {
      type: String,
    },
    leaseID: {
      type: String,
    },
    links: {
      type: [String],
    },
    ownerAddress: {
      type: String,
    },
    ownerCityDocumentExpedition: {
      type: String,
    },
    ownerDocumentId: {
      type: Number,
    },
    ownerEmail: {
      type: String,
    },
    ownerFirstName: {
      type: String,
    },
    ownerLastName: {
      type: String,
    },
    ownerPhone: {
      type: String,
    },
    ownerTypeDocument: {
      type: String,
    },
    start: {
      type: String,
    },
    status: {
      type: String,
    },
    tenantDocumentId: {
      type: Number,
    },
    tenantEmail: {
      type: String,
    },
    tenantFirstName: {
      type: String,
    },
    tenantLastName: {
      type: String,
    },
    tenantPhone: {
      type: String,
    },
    tenantTypeDocument: {
      type: String,
    },
    tenantCityDocumentExpedition: {
      type: String,
    },
    contractSignID: {
      type: Number,
    },
  },
  { timestamps: true },
);

LeaseContractSchema.methods.transform = function() {
  const transformed = {
    id: this.id,
    finish: this.finish,
    leaseID: this.leaseID,
    links: this.links,
    ownerAddress: this.ownerAddress,
    ownerCityDocumentExpedition: this.ownerCityDocumentExpedition,
    ownerDocumentId: this.ownerDocumentId,
    ownerEmail: this.ownerEmail,
    ownerFirstName: this.ownerFirstName,
    ownerLastName: this.ownerLastName,
    ownerPhone: this.ownerPhone,
    ownerTypeDocument: this.ownerTypeDocument,
    start: this.start,
    status: this.status,
    tenantDocumentId: this.tenantDocumentId,
    tenantEmail: this.tenantEmail,
    tenantFirstName: this.tenantFirstName,
    tenantLastName: this.tenantLastName,
    tenantPhone: this.tenantPhone,
    tenantTypeDocument: this.tenantTypeDocument,
    tenantCityDocumentExpedition: this.tenantCityDocumentExpedition,
    contractSignID: this.contractSignID,
  };

  return transformed;
};

export const LeaseContract: any = model("LeaseContract", LeaseContractSchema);
