import { Season } from "../../models/season-model.js";
import mongoose from "mongoose";

describe("Season Model Test", () => {
  const validSeasonData = {
    season: "2024",
    rounds: 24,
    champion: {
      givenName: "Max",
      familyName: "Verstappen",
      nationality: "Dutch",
      constructorName: "Red Bull Racing"
    }
  };

  it("should create & save season successfully", async () => {
    const validSeason = new Season(validSeasonData);
    const savedSeason = await validSeason.save();

    expect(savedSeason._id).toBeDefined();
    expect(savedSeason.season).toBe(validSeasonData.season);
    expect(savedSeason.rounds).toBe(validSeasonData.rounds);
    expect(savedSeason.champion?.givenName).toBe(validSeasonData.champion.givenName);
  });

  it("should create season without champion", async () => {
    const seasonWithoutChampion = new Season({
      season: "2025",
      rounds: 24
    });
    const savedSeason = await seasonWithoutChampion.save();

    expect(savedSeason._id).toBeDefined();
    expect(savedSeason.season).toBe("2025");
    expect(savedSeason.rounds).toBe(24);
    expect(savedSeason.champion).toBeUndefined();
  });

  it("should fail to save season without required fields", async () => {
    const seasonWithoutRequiredField = new Season({ season: "2024" });
    let err: unknown;

    try {
      await seasonWithoutRequiredField.save();
    } catch (error) {
      err = error;
    }

    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
  });

  it("should fail to save season with duplicate season year", async () => {
    const season1 = new Season(validSeasonData);
    await season1.save();

    const season2 = new Season(validSeasonData);
    let err: unknown;

    try {
      await season2.save();
    } catch (error) {
      err = error;
    }

    expect(err).toBeDefined();
    expect((err as { code?: number }).code).toBe(11000);
  });
}); 