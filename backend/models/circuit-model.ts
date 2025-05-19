import mongoose from "mongoose";

const LocationSchema = new mongoose.Schema({
  lat: {
    type: String,
    required: true,
  },
  long: {
    type: String,
    required: true,
  },
  locality: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
});

const CircuitSchema = new mongoose.Schema(
  {
    circuitId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    url: {
      type: String,
      required: true,
    },
    circuitName: {
      type: String,
      required: true,
      index: true,
    },
    location: {
      type: LocationSchema,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for circuit name searches
CircuitSchema.index({ circuitName: "text" });

// Index for country searches
CircuitSchema.index({ "location.country": 1 });

export const Circuit = mongoose.model("Circuit", CircuitSchema); 