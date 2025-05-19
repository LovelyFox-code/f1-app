import mongoose, { Schema } from "mongoose";

const SeasonSchema = new mongoose.Schema(
  {
    season: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    rounds: {
      type: Number,
      required: true,
    },
    champion: {
      driver: {
        type: Schema.Types.ObjectId,
        ref: "Driver",
        required: true,
      },
      constructor: {
        type: Schema.Types.ObjectId,
        ref: "Constructor",
        required: true,
      },
      points: {
        type: Number,
        required: true,
      },
      wins: {
        type: Number,
        required: true,
      },
      podiums: {
        type: Number,
        required: true,
      },
    },
    constructorChampion: {
      constructor: {
        type: Schema.Types.ObjectId,
        ref: "Constructor",
        required: true,
      },
      points: {
        type: Number,
        required: true,
      },
      wins: {
        type: Number,
        required: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

export const Season = mongoose.model("Season", SeasonSchema); 