import { useState } from "react";
import "./stripcreate.css";
import "./strip.css";
import "./inputstrip.css";
import { FlightPlanData, StripData } from "./types";

type stripEditProps = {
  onEdit: (newStrip: FlightPlanData) => void;
  activeStrip: StripData | null;
  onClose: () => void;
};

export default function StripEditWindow({
  onEdit,
  activeStrip,
  onClose,
}: stripEditProps) {
  const [newStripData, setNewStripData] = useState<FlightPlanData>(
    activeStrip!["fpdata"]
  );

  const [error, setError] = useState<string | null>(null);
  //const [selectedStripType, setSelectedStripType] = useState<string>("DEP");

  function handleStripEdit() {
    if (!newStripData["cs"]) {
      setError("Callsign cannot be empty");
      return;
    }

    onEdit(newStripData);
    onClose();
  }

  function handleDataChange(key: string, value: string) {
    setNewStripData((prev: any) => ({
      ...prev,
      [key]: value.toUpperCase(),
    }));
  }

  const stripType = activeStrip?.type?.toLowerCase();

  return (
    <div className="window-container">
      <div className="window-titlebar">Edit Strip - {newStripData.cs}</div>
      <div className="window-content">
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
            onClick={handleStripEdit}
            className="create-close-button create"
          >
            <span className="material-symbols-outlined">check</span>
          </button>
        </div>
      </div>
    </div>
  );
}
