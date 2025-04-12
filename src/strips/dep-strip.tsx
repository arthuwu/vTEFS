import "../index.css";
import "../strip.css";
import { StripFunctionProps, StripHandleProps } from "../strip";
import { StripData } from "../types";

type StripProps = {
  stripData: StripData;
  stripFunctions: StripFunctionProps;
  stripHandle: StripHandleProps;
};

function formatAltitude(level: string | null) {
  if (!level) return;

  const match = String(level)!.match(/^\d+/);

  if (!match) return;

  const num = parseInt(match[0]);

  if (num % 1000 !== 0) {
    const meters = Math.round(num / 3.281 / 100) * 10;
    return "S" + meters.toString().padStart(4, "0");
  }

  const reqdLevel: string = match[0].padStart(5, "0").slice(0, 3);

  if (num < 11000) {
    return "A" + reqdLevel;
  }

  return reqdLevel;
}

export function DepStrip({
  stripData,
  stripFunctions,
  stripHandle,
}: StripProps) {
  const { listeners, attributes } = stripHandle;

  return (
    <>
      <div className="inner-strip-container dep-background dep-container">
        <div className="strip-callsign-container">
          <div className="eobt">{stripData["fpdata"].eobt}</div>
          {stripData["fpdata"].fr !== "I" && (
            <div className="fr">{stripData["fpdata"].fr}</div>
          )}
          <div {...listeners} {...attributes} className="cs">
            {stripData["fpdata"].cs}
          </div>
          <div className="atyp">{stripData["fpdata"].atyp}</div>
          <div className="wtc">{stripData["fpdata"].wtc}</div>
          <div className="ssr">{stripData["fpdata"].ssr}</div>
          <div onClick={stripFunctions.setCftFlag} className="ctl-cft-flag">
            {stripData["flagdata"].cft ? "↑" : ""}
          </div>
        </div>
        <div className="drwy">{stripData["fpdata"].drwy}</div>
        <div className="rfl">{formatAltitude(stripData["fpdata"].rfl)}</div>
        <div className="sid">{stripData["fpdata"].sid}</div>
        <div className="ades">{stripData["fpdata"].ades}</div>
        <div className="bay">{stripData["fpdata"].bay}</div>
        <div className="atis">{stripData["fpdata"].atis}</div>
        <div className="qnh">{stripData["fpdata"].qnh}</div>
        <div className="ttr">{stripData["fpdata"].ttr}</div>
        <div className="er">{stripData["fpdata"].er}</div>
        <div className="ps_c">{stripData["fpdata"].ps_c}</div>
        <div className="cfl">{formatAltitude(stripData["fpdata"].cfl)}</div>
        <div className="tsat">
          {stripData["fpdata"].tsat ? stripData["fpdata"].tsat : "TSAT"}
        </div>
        <div className="ctot">
          {stripData["fpdata"].ctot ? stripData["fpdata"].ctot : "CTOT"}
        </div>
        <div className="etot">{stripData["fpdata"].etot}</div>
        <div
          onClick={() =>
            stripFunctions.setWindowToggle({
              ...stripFunctions.windowToggle,
              twySelect: stripFunctions.windowToggle["twySelect"]
                ? false
                : true,
            })
          }
          className="twy"
        >
          {stripData["fpdata"].twy}
        </div>
        <div className="tsatrmk">{stripData["fpdata"].tsatrmk}</div>
        <div className="ctotrmk">{stripData["fpdata"].ctotrmk}</div>
        <div className="cdmrmk">{stripData["fpdata"].cdmrmk}</div>
        <div className="act">{stripData["fpdata"].act}</div>
        <div onClick={stripFunctions.setFPCFlag} className="fpc_flag tickbox">
          {stripData["flagdata"].fpc_flag ? "✓" : ""}
        </div>
        <div onClick={stripFunctions.setCFlag} className="c_flag tickbox">
          {stripData["flagdata"].c_flag ? "✓" : ""}
        </div>
      </div>
    </>
  );
}

export function DepStripPartial({
  stripData,
  stripFunctions,
  stripHandle,
}: StripProps) {
  const { listeners, attributes } = stripHandle;
  return (
    <div className="inner-strip-container dep-background dep-partial-container">
      <div {...listeners} {...attributes} className="strip-callsign-container">
        <div className="eobt">{stripData["fpdata"].eobt}</div>
        {stripData["fpdata"].fr !== "I" && (
          <div className="fr">{stripData["fpdata"].fr}</div>
        )}
        <div className="cs">{stripData["fpdata"].cs}</div>
        <div className="atyp">{stripData["fpdata"].atyp}</div>
        <div className="wtc">{stripData["fpdata"].wtc}</div>
        <div className="ssr">{stripData["fpdata"].ssr}</div>
      </div>
      <div className="drwy">{stripData["fpdata"].drwy}</div>
      <div className="rfl">{formatAltitude(stripData["fpdata"].rfl)}</div>
      <div className="sid">{stripData["fpdata"].sid}</div>
      <div className="ades">{stripData["fpdata"].ades}</div>
      <div className="bay">{stripData["fpdata"].bay}</div>
      <div className="act">{stripData["fpdata"].act}</div>
      <div className="cdmrmk">{stripData["fpdata"].cdmrmk}</div>
    </div>
  );
}
