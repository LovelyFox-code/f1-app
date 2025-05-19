import mongoose from "mongoose";

const ConstructorSchema = new mongoose.Schema(
  {
    constructorId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      index: true,
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
  },
  {
    timestamps: true,
  }
);

// Index for name searches
ConstructorSchema.index({ name: "text" });

export const Constructor = mongoose.model("Constructor", ConstructorSchema);
