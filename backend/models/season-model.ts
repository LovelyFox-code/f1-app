import mongoose from "mongoose";


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
      type: {
        givenName: String,
        familyName: String,
        nationality: String,
        constructorName: String,
      },
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Season = mongoose.model("Season", SeasonSchema); 