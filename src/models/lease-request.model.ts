import { Schema, model } from "mongoose";

export interface Link {
  id: string;
  link: string;
  institution: string;
}
export interface LeaseReqhestInput {
  active: boolean;
  address: string;
  admon: number;
  amount: number;
  city: string;
  duration: string;
  includeAdmon?: boolean;
  neighborhood: string;
  ownerEmail: string;
  ownerFirstName: string;
  ownerLastName: string;
  ownerPhone: string;
  state: string;
  tenantDocumentId: number;
  tenantCityDocumentExpedition: string;
  tenantEmail: string;
  tenantFirstName: string;
  tenantLastName: string;
  tenantPhone: string;
  tenantTypeDocument: string;
  typeProperty: string;
  links: Link[];
  total: number;
  status:
    | "in-process"
    | "pre-approved"
    | "tenant-rejected"
    | "owner-rejected"
    | "owner-process"
    | "signed"
    | "cancelled";
}

export interface LeaseRequestDocument extends LeaseReqhestInput {
  createdAt: Date;
  updatedAt: Date;
}

const LeaseRequestSchema = new Schema(
  {
    address: {
      type: String,
      required: [true, "The address is required"],
    },
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
    links: {
      type: [
        {
          link: String,
          institution: String,
        },
      ],
      default: [],
    },
    neighborhood: {
      type: String,
      required: [true, "The neighborhood is required"],
    },
    ownerEmail: {
      type: String,
      required: [true, "The owner email is required"],
    },
    ownerFirstName: {
      type: String,
      required: [true, "The owner first name is required"],
    },
    ownerLastName: {
      type: String,
      required: [true, "The owner last name is required"],
    },
    ownerPhone: {
      type: String,
      required: [true, "The owner phone name is required"],
    },
    state: {
      type: String,
      required: [true, "The state is required"],
    },
    tenantCityDocumentExpedition: {
      type: String,
      required: [true, "The tenant document city expedition is required"],
    },
    tenantDocumentId: {
      type: Number,
      required: [true, "The owner cc tenant is required"],
    },
    tenantEmail: {
      type: String,
      required: [true, "The tenant email is required"],
    },
    tenantFirstName: {
      type: String,
      required: [true, "The tenant first name is required"],
    },
    tenantLastName: {
      type: String,
      required: [true, "The tenant last name is required"],
    },
    tenantPhone: {
      type: String,
      required: [true, "The tenant phone name is required"],
    },
    tenantTypeDocument: {
      type: String,
      required: [true, "The tenant type document is required"],
    },
    total: {
      type: Number,
      required: [true, "The total is required"],
    },
    typeProperty: {
      type: String,
      required: [true, "The typeProperty is required"],
    },
    status: {
      type: String,
      default: "in-process",
    },
  },
  { timestamps: true },
);

LeaseRequestSchema.methods.transform = function() {
  const transformed = {
    id: this.id,
    active: this.active,
    address: this.address,
    admon: this.admon,
    amount: this.amount,
    createdAt: this.createdAt,
    city: this.city,
    duration: this.duration,
    fee: this.fee,
    includeAdmon: this.includeAdmon,
    institution: this.institution,
    links: this.links,
    neighborhood: this.neighborhood,
    ownerEmail: this.ownerEmail,
    ownerFirstName: this.ownerFirstName,
    ownerLastName: this.ownerLastName,
    ownerPhone: this.ownerPhone,
    state: this.state,
    status: this.status,
    tenantDocumentId: this.tenantDocumentId,
    tenantCityDocumentExpedition: this.tenantCityDocumentExpedition,
    tenantEmail: this.tenantEmail,
    tenantFirstName: this.tenantFirstName,
    tenantLastName: this.tenantLastName,
    tenantPhone: this.tenantPhone,
    tenantTypeDocument: this.tenantTypeDocument,
    total: this.total,
    typeProperty: this.typeProperty,
  };

  return transformed;
};

export const LeaseRequest: any = model("LeaseRequest", LeaseRequestSchema);
