export type CurrentBay = "RDY" | "STUP" | "PUSH" | "ACT" | "ARR" | "GMCAG";

export type StripData = {
  id: string;
  data: string;
};

export type Bay = {
  id: CurrentBay;
  title: string;
};
