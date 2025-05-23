import mongoose from "mongoose"

const RaceSchema = new mongoose.Schema({
  season: { type: String, required: true },
  round: { type: String, required: true },
  raceName: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },

  circuit: {
    circuitId: { type: String, required: true },
    circuitName: { type: String, required: true },
    location: {
      lat: { type: String, required: true },
      long: { type: String, required: true },
      locality: { type: String, required: true },
      country: { type: String, required: true }
    }
  },

  results: [{
    number: { type: String, required: true },
    position: { type: String, required: true },
    positionText: { type: String, required: true },
    points: { type: String, required: true },

    driver: {
      driverId: { type: String, required: true },
      permanentNumber: { type: String }, // made optional
      code: { type: String, required: true },
      givenName: { type: String, required: true },
      familyName: { type: String, required: true },
      dateOfBirth: { type: String, required: true },
      nationality: { type: String, required: true }
    },

    constructor: {
      constructorId: { type: String, required: true },
      name: { type: String, required: true },
      nationality: { type: String, required: true }
    },

    grid: { type: String, required: true },
    laps: { type: String, required: true },
    status: { type: String, required: true },

    time: {
      millis: { type: String, default: null },
      time: { type: String, default: null }
    },

    fastestLap: {
      rank: { type: String, default: null },
      lap: { type: String, default: null },
      time: {
        time: { type: String, default: null }
      }
    }
  }]
}, {
  timestamps: true
});

RaceSchema.index({ season: 1, round: 1 }, { unique: true });

export const Race = mongoose.model("Race", RaceSchema);
