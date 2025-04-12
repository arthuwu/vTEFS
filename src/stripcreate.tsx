import { useState } from "react";
import "./stripcreate.css";
import { FlightPlanData, StripData } from "./types";
import { v4 as uuidv4 } from "uuid";
import { UpdateStrip } from "./updatestrip";

type stripCreateProps = {
  onCreate: (newStrip: StripData) => void;
  onClose: () => void;
};

export default function StripCreateWindow({
  onCreate,
  onClose,
}: stripCreateProps) {
  const [newStripData, setNewStripData] = useState<FlightPlanData>({
    eobt: null,
    fr: null,
    cs: "",
    atyp: null,
    wtc: null,
    ssr: null,
    drwy: null,
    arwy: null,
    rfl: null,
    sid: null,
    adep: null,
    ades: null,
    bay: null,
    atis: null,
    qnh: null,
    ttr: null,
    er: null,
    cfl: null,
    tsat: null,
    ctot: null,
    etot: null,
    ps_c: null,
    twy: null,
    tsatrmk: null,
    ctotrmk: null,
    cdmrmk: null,
    a_rmk: null,
    act: null,
  });

  const [error, setError] = useState<string | null>(null);
  const [selectedStripType, setSelectedStripType] = useState<string>("DEP");

  function handleStripCreate() {
    if (!newStripData["cs"]) {
      setError("Callsign cannot be empty");
      return;
    }

    const newStrip: StripData = {
      id: uuidv4(),
      type: selectedStripType,
      fpdata: newStripData,
      flagdata: {
        cft: false,
        ctl: false,
        fpc_flag: false,
        c_flag: false,
        t_flag: false,
      },
      size: "full",
      indent: false,
      canvas: null,
    };

    UpdateStrip(newStrip);

    onCreate(newStrip);
    onClose();
  }

  function handleDataChange(key: string, value: string) {
    setNewStripData((prev: any) => ({
      ...prev,
      [key]: value.toUpperCase(),
    }));
  }

  const stripType = selectedStripType.toLowerCase();

  return (
    <div className="window-container">
      <div className="window-titlebar">New Strip</div>
      <div className="window-content">
        <div className="window-type-select">
          Strip type:
          <select
            value={selectedStripType}
            onChange={(inp: any) => setSelectedStripType(inp.target.value)}
          >
            <option value="DEP">DEP</option>
            <option value="ARR">ARR</option>
            <option value="EMER">EMER</option>
            <option value="VFR">VFR</option>
            <option value="BLK">BLK</option>
            <option value="GRN">GREEN</option>
            <option value="WHT">WHITE</option>
          </select>
        </div>
        <div className="window-strip">
          <div
            className={
              "select-strip-" + stripType + " " + stripType + "-background"
            }
          >
            {Object.entries(newStripData).map(([key, value]) => (
              <div key={key} className={key}>
                <input
                  type="text"
                  placeholder={key}
                  value={value ?? ""}
                  onChange={(e) => handleDataChange(key, e.target.value)}
                />
              </div>
            ))}
          </div>
        </div>
        <div className="close-container">
          <button onClick={onClose} className="create-close-button close">
            <span className="material-symbols-outlined">close</span>
          </button>
          <button
            onClick={handleStripCreate}
            className="create-close-button create"
          >
            <span className="material-symbols-outlined">check</span>
          </button>
        </div>
      </div>
    </div>
  );
}
