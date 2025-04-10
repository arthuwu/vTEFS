import { useState } from "react";
import "./stripcreate.css";
import { FlightPlanData, StripData } from "./types";
import { v4 as uuidv4 } from "uuid";

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
    ps_c: null,
    twy: null,
    tsatrmk: null,
    ctotrmk: null,
    cdmrmk: null,
    a_rmk: null,
    act: null,
  });

  const [error, setError] = useState<string | null>(null);

  function handleStripCreate() {
    if (!newStripData["cs"]) {
      setError("Callsign cannot be empty");
      return;
    }

    const newStrip: StripData = {
      id: uuidv4(),
      type: "DEP",
      fpdata: newStripData,
      flagdata: { cft: false, ctl: false, fpc_flag: false, c_flag: false },
      size: "full",
      indent: false,
    };
    onCreate(newStrip);
    onClose();
  }

  function handleDataChange(key: string, value: string) {
    setNewStripData((prev: any) => ({
      ...prev,
      [key]: value,
    }));
  }

  return (
    <div className="window-container">
      <div className="window-titlebar">New Strip</div>
      <div className="window-strip">
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
      <button onClick={onClose} className="create-close-button">
        ✗
      </button>
      <button onClick={handleStripCreate} className="create-close-button">
        ✓
      </button>
    </div>
  );
}
