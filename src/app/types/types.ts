import { LetterStatus } from "./enums";

export type Chat = {
  word: string;
  user: string;
  color: string;
  isMod: boolean;
};

export type RGBColor = [number, number, number];

export type Scores = {
  [key: string]: number;
};

export type TimeoutStatus = {
  [key: string]: boolean;
};

export type Sound = {
  file: string;
  volume: number;
};

export type LetterStatusObject = {
  [key: string]: LetterStatus;
};

export type TimeoutStatusObject = {
  [key: string]: boolean;
};

export type UserScoresObject = {
  [key: string]: number;
};
