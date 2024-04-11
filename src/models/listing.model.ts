import { Schema, model } from "mongoose";

export interface ListingInput {
  address: string;
  admon: string;
  amenities: [string];
  amount: number;
  area: number;
  bathrooms: number;
  city: number;
  deposit: number;
  duration: number;
  floors: number;
  includeAdmon: boolean;
  neighborhood: string;
  parkings: number;
  rooms: number;
  state: string;
  typeProperty: string;
  total: number;
}

export interface ListingDocument extends ListingInput {
  createdAt: Date;
  updatedAt: Date;
}

const ListingSchema = new Schema(
  {
    address: {
      type: String,
      required: [true, "The address is required"],
      unique: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
    admon: {
      type: Number,
      required: [true, "The admon is required"],
    },
    amenities: {
      type: [String],
      required: [true, "The amenities is required"],
    },
    amount: {
      type: Number,
      required: [true, "The amount is required"],
    },
    area: {
      type: Number,
      required: [true, "The area is required"],
    },
    bathrooms: {
      type: Number,
      required: [true, "The bathrooms is required"],
    },
    city: {
      type: String,
      required: [true, "The city is required"],
    },
    deposit: {
      type: Number,
      required: [true, "The deposit is required"],
    },
    duration: {
      type: Number,
      required: [true, "The duration is required"],
    },
    floors: {
      type: Number,
      required: [true, "The floors is required"],
    },
    includeAdmon: {
      type: Boolean,
      default: false,
    },
    neighborhood: {
      type: String,
      required: [true, "The neighborhood is required"],
    },
    parkings: {
      type: Number,
      required: [true, "The parkings is required"],
    },
    rooms: {
      type: Number,
      required: [true, "The rooms is required"],
    },
    state: {
      type: String,
      required: [true, "The state is required"],
    },
    typeProperty: {
      type: String,
      required: [true, "The typeProperty is required"],
    },
    total: {
      type: Number,
      required: [true, "The total is required"],
    },
  },
  { timestamps: true },
);

module.exports = model("Listing", ListingSchema);
