export type CurrentBay = "RDY" | "STUP" | "PUSH" | "ACT" | "ARR" | "GMCAG";

export type StripData = {
  id: string;
  type: "DEP" | "ARR" | "EMER" | "VFR" | "BLK";
  fpdata: FlightPlanData;
  flagdata: FlagData;
  size: "full" | "half";
  indent: boolean;
};

export type Bay = {
  id: CurrentBay;
  title: string;
};

export type FlightPlanData = {
  //callsign column
  eobt: number | null;
  fr: string | null;
  cs: string;
  atyp: string | null;
  wtc: string | null;
  ssr: number | null;
  //fdata column
  drwy: string | null;
  arwy: string | null;
  rfl: string | null;
  sid: string | null;
  adep: string | null;
  ades: string | null;
  bay: string | null;
  //states
  atis: string | null;
  qnh: number | null;
  ttr: string | null;
  er: string | null; //non-ttr exit route
  cfl: string | null;
  tsat: number | null;
  ctot: number | null;
  ps_c: "R" | "G" | "B" | "NS" | null;
  twy: string | null; //taxiways
  tsatrmk: string | null;
  ctotrmk: string | null;
  cdmrmk: string | null;
  a_rmk: string | null; //arrivals
  act: number | "T/O" | null; //bottom right corner
};

export type FlagData = {
  cft: boolean;
  ctl: boolean;
  fpc_flag: boolean; //fp checked flag (top)
  c_flag: boolean; //clearance flag (bottom)
};
