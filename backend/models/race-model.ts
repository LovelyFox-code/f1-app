import mongoose, { Schema } from "mongoose";

const RaceResultSchema = new mongoose.Schema({
  number: String,
  position: {
    type: String,
    required: true,
  },
  positionText: {
    type: String,
    required: true,
  },
  points: {
    type: String,
    required: true,
  },
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
  grid: {
    type: String,
    required: true,
  },
  laps: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  time: {
    millis: String,
    time: String,
  },
  fastestLap: {
    rank: String,
    lap: String,
    time: {
      time: String,
    },
    averageSpeed: {
      units: String,
      speed: String,
    },
  },
});

const RaceSchema = new mongoose.Schema(
  {
    season: {
      type: String,
      required: true,
      index: true,
    },
    round: {
      type: Number,
      required: true,
    },
    raceName: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    time: String,
    circuit: {
      type: Schema.Types.ObjectId,
      ref: "Circuit",
      required: true,
    },
    results: [RaceResultSchema],
  },
  {
    timestamps: true,
  }
);

// Compound index for season and round
RaceSchema.index({ season: 1, round: 1 }, { unique: true });

// Index for date searches
RaceSchema.index({ date: 1 });

export const Race = mongoose.model("Race", RaceSchema); 