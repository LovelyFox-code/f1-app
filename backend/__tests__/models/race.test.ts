import { Race } from "../../models/race-model.js";
import mongoose from "mongoose";

describe("Race Model Test", () => {
  const validRaceData = {
    season: "2024",
    round: "1",
    raceName: "Bahrain Grand Prix",
    date: new Date("2024-03-02"),
    time: "15:00:00Z",
    circuit: {
      circuitId: "bahrain",
      circuitName: "Bahrain International Circuit",
    },
    results: [{
      number: "44",
      position: "1",
      positionText: "1",
      points: "25",
      driver: {
        driverId: "hamilton",
        givenName: "Lewis",
        familyName: "Hamilton",
        nationality: "British"
      },
      constructorName: {
        constructorId: "mercedes",
        name: "Mercedes",
        nationality: "German"
      }
    }]
  };

  it("should create & save race successfully", async () => {
    const validRace = new Race(validRaceData);
    const savedRace = await validRace.save();

    expect(savedRace._id).toBeDefined();
    expect(savedRace.season).toBe(validRaceData.season);
    expect(savedRace.round).toBe(validRaceData.round);
    expect(savedRace.raceName).toBe(validRaceData.raceName);
    expect(savedRace.results?.[0]?.driver?.driverId ?? null).toBe(validRaceData.results[0].driver.driverId);
  });

  it("should fail to save race without required fields", async () => {
    const raceWithoutRequiredField = new Race({ season: "2024" });
    let err: unknown;

    try {
      await raceWithoutRequiredField.save();
    } catch (error) {
      err = error;
    }

    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
  });

  it("should fail to save race with duplicate season and round", async () => {
    const race1 = new Race(validRaceData);
    await race1.save();

    const race2 = new Race(validRaceData);
    let err: unknown;

    try {
      await race2.save();
    } catch (error) {
      err = error;
    }

    expect(err).toBeDefined();
    expect((err as { code?: number }).code).toBe(11000);
  });
}); 