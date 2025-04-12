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

type buttonData = {
  position: [number, number, number];
  label: string;
  output: string;
  type: string;
};

const buttonMapping: Record<string, buttonData> = {
  to_bay: {
    position: [100, 146, 0],
    label: "TO BAY",
    output: "TO BAY",
    type: "large",
  },
  call_twr: {
    position: [200, 146, 0],
    label: "CALL TWR",
    output: "",
    type: "large",
  },
  standby: {
    position: [300, 146, 0],
    label: "STANDBY",
    output: "STBY",
    type: "large",
  },
  hold1: {
    position: [742, 446, 0],
    label: "⯃",
    output: "#",
    type: "hex",
  },
  j1: { position: [207, 523, 0], label: "", output: "J1 HP", type: "hp" },
  j2: { position: [226, 523, 0], label: "", output: "J2 HP", type: "hp" },
  j3: { position: [288, 523, 0], label: "", output: "J3 HP", type: "hp" },
  j9: { position: [750, 523, 0], label: "", output: "J9 HP", type: "hp" },
  j10: { position: [807, 523, 0], label: "", output: "J10 HP", type: "hp" },
  j11: { position: [819, 523, 0], label: "", output: "J11 HP", type: "hp" },
  k1: { position: [207, 556, 0], label: "", output: "K1 HP", type: "hp" },
  k2: { position: [323, 556, 55], label: "", output: "K2 HP", type: "hp" },
  k6: { position: [730, 556, -55], label: "", output: "K6 HP", type: "hp" },
  k7: { position: [819, 556, 0], label: "", output: "K7 HP", type: "hp" },
  cat2_25l: {
    position: [772, 570, 90],
    label: "",
    output: "CAT II HP",
    type: "hp",
  },
  cat2_07r: {
    position: [261, 570, 90],
    label: "",
    output: "CAT II HP",
    type: "hp",
  },
  k5: { position: [654, 556, 0], label: "K5", output: "K5", type: "twy" },
  k3: { position: [399, 556, 0], label: "K3", output: "K3", type: "twy" },
  k: { position: [469, 570, 0], label: "K", output: "K", type: "twy" },
};

export default function TwySelectWindow({
  activeStrip,
  onClose,
  bayContent,
  setBayContent,
}: twySelectProps) {
  const [taxiRoute, setTaxiRoute] = useState<string>(activeStrip?.fpdata.twy!);

  if (!activeStrip) return;

  function handleDataChange(value: string) {
    setTaxiRoute(value);
  }

  function handleMapPress(buttonOutput: string) {
    setTaxiRoute((prev: string) =>
      prev ? prev + " " + buttonOutput : buttonOutput
    );
  }

  function handleTaxiwaySubmit() {
    const currentBay: string = Object.keys(bayContent).find((bay) =>
      bayContent[bay].some((item) => item.id === activeStrip!.id)
    )!;

    setBayContent((prev: any) => {
      const newData = { ...prev };

      newData[currentBay] = newData[currentBay].map((item) =>
        item.id === activeStrip!.id
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
        <div className="button-overlay">
          {Object.entries(buttonMapping).map(
            ([
              id,
              {
                position: [x, y, rot],
                label,
                output,
                type,
              },
            ]) => (
              <button
                onClick={() => handleMapPress(output)}
                key={id}
                id={id}
                className={"twy-button twy-button-" + type}
                style={{
                  left: `${x - 12}px`,
                  top: `${y + 16}px`,
                  transform: `rotate(${rot}deg)`,
                }}
              >
                {label}
              </button>
            )
          )}
          <GroundMapSVG />
        </div>
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
