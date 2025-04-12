import { useState } from "react";
import "./index.css";
import "./twyselect.css";
import "./stripcreate.css";
import { StripData } from "./types";
import GroundMapSVG from "./taxi-svg";

type twySelectProps = {
  activeStrip: StripData | null;
  onClose: () => void;
  bayContent: any;
  setBayContent: (any) => void;
};

export default function TwySelectWindow({
  activeStrip,
  onClose,
  bayContent,
  setBayContent,
}: twySelectProps) {
  const [taxiRoute, setTaxiRoute] = useState<string>("");

  if (!activeStrip) return;

  function handleDataChange(value: string) {
    setTaxiRoute(value);
  }

  function handleTaxiwaySubmit() {
    const currentBay: string = Object.keys(bayContent).find((bay) =>
      bayContent[bay].some((item) => item.id === activeStrip!.id)
    )!;

    setBayContent((prev: any) => {
      const newData = { ...prev };

      newData[currentBay] = newData[currentBay].map((item) =>
        item.id == activeStrip!.id
          ? { ...item, fpdata: { ...item.fpdata, twy: taxiRoute } }
          : item
      );

      return newData;
    });
    onClose();
  }

  return (
    <div className="window-container twy">
      <div className="window-titlebar">
        Taxi Route - {activeStrip["fpdata"].cs}
      </div>
      <div className="window-content">
        <GroundMapSVG />
        <div className="close-container">
          <button onClick={onClose} className="create-close-button close">
            <span className="material-symbols-outlined">close</span>
          </button>
          <input
            type="text"
            value={taxiRoute ?? ""}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleDataChange(e.target.value)
            }
          />
          <button
            onClick={handleTaxiwaySubmit}
            className="create-close-button create"
          >
            <span className="material-symbols-outlined">check</span>
          </button>
        </div>
      </div>
    </div>
  );
}
