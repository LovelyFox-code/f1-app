import mongoose from "mongoose";

const DriverSchema = new mongoose.Schema(
  {
    driverId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    permanentNumber: {
      type: String,
      sparse: true,
    },
    code: {
      type: String,
      sparse: true,
    },
    givenName: {
      type: String,
      required: true,
    },
    familyName: {
      type: String,
      required: true,
    },
    dateOfBirth: {
      type: String,
      required: true,
    },
    nationality: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    championships: {
      type: Number,
      default: 0,
    },
    raceWins: {
      type: Number,
      default: 0,
    },
    podiums: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for driver name searches
DriverSchema.index({ givenName: 1, familyName: 1 });

// Virtual for full name
DriverSchema.virtual("fullName").get(function () {
  return `${this.givenName} ${this.familyName}`;
});

export const Driver = mongoose.model("Driver", DriverSchema); 