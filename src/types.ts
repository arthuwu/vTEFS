export type CurrentBay = "RDY" | "PUSH" | "TAXI";

export type StripData = {
  id: string;
  bay: CurrentBay;
  data: string;
};

export type Bay = {
  id: CurrentBay;
  title: string;
};
