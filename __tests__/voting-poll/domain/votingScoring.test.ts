import { evaluateVote } from "@/features/voting-poll/domain/votingScoring";

describe("evaluateVote", () => {
  it("returns correct=true and delta=+100 when vote matches", () => {
    expect(evaluateVote(["AFIRMATIVO"], "AFIRMATIVO")).toEqual({
      correct: true,
      delta: 100,
    });
    expect(evaluateVote(["NEGATIVO"], "NEGATIVO")).toEqual({
      correct: true,
      delta: 100,
    });
  });

  it("groups AUSENTE and ABSTENCION — both are valid for that button", () => {
    expect(evaluateVote(["AUSENTE", "ABSTENCION"], "AUSENTE")).toEqual({
      correct: true,
      delta: 100,
    });
    expect(evaluateVote(["AUSENTE", "ABSTENCION"], "ABSTENCION")).toEqual({
      correct: true,
      delta: 100,
    });
  });

  it("returns correct=false and delta=0 when vote doesn't match", () => {
    expect(evaluateVote(["AFIRMATIVO"], "NEGATIVO")).toEqual({
      correct: false,
      delta: 0,
    });
    expect(evaluateVote(["NEGATIVO"], "AFIRMATIVO")).toEqual({
      correct: false,
      delta: 0,
    });
    expect(evaluateVote(["AFIRMATIVO"], "AUSENTE")).toEqual({
      correct: false,
      delta: 0,
    });
  });

  it("does not match AUSENTE/ABSTENCION group against AFIRMATIVO", () => {
    expect(evaluateVote(["AUSENTE", "ABSTENCION"], "AFIRMATIVO")).toEqual({
      correct: false,
      delta: 0,
    });
  });
});
