import "../index.css";
import "../strip.css";
import { StripFunctionProps, StripHandleProps } from "../strip";
import { StripData } from "../types";

type StripProps = {
  stripData: StripData;
  stripFunctions: StripFunctionProps;
  stripHandle: StripHandleProps;
};

export function ArrStrip({
  stripData,
  stripFunctions,
  stripHandle,
}: StripProps) {
  const { listeners, attributes } = stripHandle;

  return (
    <div className="inner-strip-container arr-background arr-container">
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
        <div onClick={stripFunctions.setCtlFlag} className="ctl-cft-flag">
          {stripData["flagdata"].ctl ? "↓" : " "}
        </div>
      </div>
      <div className="arwy">{stripData["fpdata"].arwy}</div>
      <div className="adep">{stripData["fpdata"].adep}</div>
      <div className="bay">{stripData["fpdata"].bay}</div>
      <div className="a_rmk">{stripData["fpdata"].a_rmk}</div>
      <div
        onClick={() =>
          stripFunctions.setWindowToggle({
            ...stripFunctions.windowToggle,
            twySelect: stripFunctions.windowToggle["twySelect"] ? false : true,
          })
        }
        className="twy"
      >
        {stripData["fpdata"].twy}
      </div>
      <div className="act">{stripData["fpdata"].act}</div>
      <div onClick={stripFunctions.setTaxiFlag} className="t_flag tickbox">
        {stripData["flagdata"].t_flag ? "✓" : " "}
      </div>
      <div className="ghost">MA</div>
      <div className="empty"></div>
    </div>
  );
}

export function ArrStripPartial({
  stripData,
  stripFunctions,
  stripHandle,
}: StripProps) {
  const { listeners, attributes } = stripHandle;
  return (
    <div className="inner-strip-container arr-background arr-partial-container">
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
      <div className="arwy">{stripData["fpdata"].arwy}</div>
      <div className="adep">{stripData["fpdata"].adep}</div>
      <div className="bay">{stripData["fpdata"].bay}</div>
      <div className="empty"></div>
    </div>
  );
}
