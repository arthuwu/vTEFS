import { useState } from "react";
import Bay from "./bay";
import Strip from "./strip";
import StripCreateWindow from "./stripcreate";
import StripEditWindow from "./stripedit";
import { UpdateStrip } from "./updatestrip";
import "./index.css";
import "./layout.css";
import { Bay as BayData, FlightPlanData, StripData } from "./types";
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  DragOverEvent,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  closestCorners,
  DragOverlay,
  UniqueIdentifier,
  pointerWithin,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import TwySelectWindow from "./twyselect";

export type windowProps = {
  windowToggle: any;
  setWindowToggle: (any) => void;
};

export default function App() {
  const mouseSensor = useSensor(MouseSensor);
  const touchSensor = useSensor(TouchSensor);
  const keyboardSensor = useSensor(KeyboardSensor);

  const sensors = useSensors(mouseSensor, touchSensor, keyboardSensor);

  const [activeStripId, setActiveStripId] = useState<string | null>(); //active for drag overlay
  const [selectionInProg, setSelectionInProg] = useState<string | null>();
  const [bayContent, setBayContent] = useState({
    RDY: [],
    STUP: [],
    PUSH: [],
    ACT: [],
    ARR: [],
    GMCAG: [],
  });
  const [windowToggle, setWindowToggle] = useState({
    createStrip: false,
    editStrip: false,
    twySelect: false,
  });
  const [lastSelectedStrip, setLastSelectedStrip] = useState<StripData | null>(
    null
  );

  const windowProps: windowProps = {
    windowToggle: windowToggle,
    setWindowToggle: setWindowToggle,
  };

  return (
    <div className="layout-page">
      {selectionInProg && <div className="selection-blocker"></div>}
      <div className="layout-container">
        <DndContext
          autoScroll={false}
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragOver={handleDragOver}
          collisionDetection={pointerWithin}
        >
          <div className="gmc-amc-container">
            <div className="tl1">
              <Bay
                key={"RDY"}
                bay={{ id: "RDY", title: "CDC Ready to Start" }}
                strips={bayContent["RDY"]}
                handleStripClick={selectStrip}
                windowProps={windowProps}
              />
            </div>
            <div className="tl2">
              <Bay
                key={"STUP"}
                bay={{ id: "STUP", title: "Startup" }}
                strips={bayContent["STUP"]}
                handleStripClick={selectStrip}
                windowProps={windowProps}
              />
            </div>
            <div className="tl3">
              <Bay
                key={"PUSH"}
                bay={{ id: "PUSH", title: "Pushback" }}
                strips={bayContent["PUSH"]}
                handleStripClick={selectStrip}
                windowProps={windowProps}
              />
            </div>
            <div className="tl4">
              <Bay
                key={"ACT"}
                bay={{ id: "ACT", title: "Active" }}
                strips={bayContent["ACT"]}
                handleStripClick={selectStrip}
                windowProps={windowProps}
              />
            </div>
            <div className="tl5">
              <Bay
                key={"ARR"}
                bay={{ id: "ARR", title: "AMC Arrivals" }}
                strips={bayContent["ARR"]}
                handleStripClick={selectStrip}
                windowProps={windowProps}
              />
            </div>
            <div className="tl6">
              <Bay
                key={"GMCAG"}
                bay={{ id: "GMCAG", title: "GMC Active" }}
                strips={bayContent["GMCAG"]}
                handleStripClick={selectStrip}
                windowProps={windowProps}
              />
            </div>
          </div>
          {createPortal(
            <DragOverlay zIndex={100}>
              {activeStripId ? (
                <Strip
                  stripData={
                    Object.values(bayContent)
                      .flat()
                      .find((obj) =>
                        Object.values(obj).includes(activeStripId)
                      )!
                  }
                  handleClick={() => {
                    return;
                  }}
                  windowProps={windowProps}
                />
              ) : null}
            </DragOverlay>,
            document.body
          )}
        </DndContext>
      </div>
      <div className="bottom-bar">
        <button
          onClick={() =>
            setWindowToggle({ ...windowToggle, createStrip: true })
          }
        >
          Create new
        </button>
        {windowToggle["createStrip"] && (
          <StripCreateWindow
            onCreate={createNewStrip}
            onClose={() =>
              setWindowToggle({ ...windowToggle, createStrip: false })
            }
          />
        )}
        <button
          onClick={() => setSelectionInProg(selectionInProg ? null : "update")}
        >
          Update strip
        </button>
        <button
          onClick={() => setSelectionInProg(selectionInProg ? null : "delete")}
        >
          Delete strip
        </button>
        <button
          onClick={() => setSelectionInProg(selectionInProg ? null : "edit")}
        >
          Edit strip
        </button>
        {windowToggle["editStrip"] && (
          <StripEditWindow
            onEdit={EditStrip}
            activeStrip={lastSelectedStrip}
            onClose={() =>
              setWindowToggle({ ...windowToggle, editStrip: false })
            }
          />
        )}
        {windowToggle["twySelect"] && (
          <TwySelectWindow
            activeStrip={lastSelectedStrip}
            onClose={() =>
              setWindowToggle({ ...windowToggle, twySelect: false })
            }
            bayContent={bayContent}
            setBayContent={setBayContent}
          />
        )}
      </div>
    </div>
  );

  function createNewStrip(newStrip: StripData) {
    setBayContent((prev: any) => {
      return {
        ...prev,
        RDY: [...bayContent["RDY"], newStrip],
      };
    });
  }

  function DeleteStrip(stripId: string) {
    const currentBay: string = Object.keys(bayContent).find((bay) =>
      bayContent[bay].some((item) => item.id === stripId)
    )!;

    setBayContent((prev: any) => {
      return {
        ...prev,
        [currentBay]: [
          ...prev[currentBay].filter((item) => item["id"] !== stripId),
        ],
      };
    });
  }

  function OpenEditWindow() {
    setWindowToggle({ ...windowToggle, editStrip: true });
  }

  function EditStrip(activeStripData: FlightPlanData) {
    const currentBay: string = Object.keys(bayContent).find((bay) =>
      bayContent[bay].some((item) => item.id === lastSelectedStrip!.id)
    )!;

    setBayContent((prev: any) => {
      const newData = { ...prev };

      newData[currentBay] = newData[currentBay].map((item) =>
        item.id == lastSelectedStrip!.id
          ? { ...item, fpdata: activeStripData }
          : item
      );

      return newData;
    });
  }

  function selectStrip({ stripId }: { stripId: string }) {
    const strip: StripData = Object.values(bayContent)
      .flat()
      .find((item: StripData) => item.id === stripId)!;

    setLastSelectedStrip(strip);

    if (selectionInProg === "update") {
      UpdateStrip(strip);
    } else if (selectionInProg === "delete") {
      DeleteStrip(stripId);
    } else if (selectionInProg === "edit") {
      OpenEditWindow();
    }
    setSelectionInProg(null);
  }

  function exitSelection() {
    setSelectionInProg(null);
  }

  function findContainer(id: UniqueIdentifier) {
    if (id in bayContent) {
      //already a bay
      return id;
    }

    return Object.keys(bayContent).find((key) =>
      bayContent[key].some((obj) => Object.values(obj).includes(id))
    );
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;

    if (!over) return;

    const stripId = active.id as string; //active strip callsign
    const overId = over.id as string; //over strip callsign

    console.log("overID:" + overId);

    const activeBay: UniqueIdentifier = findContainer(stripId)!;
    const overBay: UniqueIdentifier = findContainer(overId)!;

    console.log("activeBay:" + activeBay);
    console.log("overBay:" + overBay);

    if (!activeBay || !overBay || activeBay === overBay) {
      return;
    }

    setBayContent((prev: any) => {
      const activeBayContent: StripData[] = prev[activeBay];
      const overBayContent: StripData[] = prev[overBay];

      const activeBayIndex = activeBayContent.findIndex((obj) =>
        Object.values(obj).includes(stripId)
      );
      const overBayIndex = overBayContent.findIndex((obj) =>
        Object.values(obj).includes(overId)
      );

      let newIndex;

      if (overId in prev) {
        //root bay
        newIndex = overBayContent.length + 1;
      } else {
        const isBelowLastItem =
          over && overBayIndex === overBayContent.length - 1;
        const modifier = isBelowLastItem ? 1 : 0;

        newIndex =
          overBayIndex >= 0
            ? overBayIndex + modifier
            : overBayContent.length + 1;
      }

      return {
        ...prev,
        [activeBay]: [
          ...prev[activeBay].filter((item) => item["id"] !== stripId),
        ],
        [overBay]: [
          ...prev[overBay].slice(0, newIndex),
          bayContent[activeBay][activeBayIndex],
          ...prev[overBay].slice(newIndex, prev[overBay].length),
        ],
      };
    });
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over) return;

    const stripId = active.id as string; //active strip callsign
    const overId = over!.id as string; //over strip callsign

    console.log("overID:" + overId);

    const activeBay: UniqueIdentifier = findContainer(stripId)!;
    const overBay: UniqueIdentifier = findContainer(overId)!;

    console.log("activeBay:" + activeBay);
    console.log("overBay:" + overBay);

    if (!activeBay || !overBay || activeBay !== overBay) {
      return;
    }

    const activeBayIndex = bayContent[activeBay].findIndex((obj) =>
      Object.values(obj).includes(stripId)
    );
    const overBayIndex = bayContent[overBay].findIndex((obj) =>
      Object.values(obj).includes(overId)
    );

    if (activeBayIndex !== overBayIndex) {
      setBayContent((strips) => ({
        ...strips,
        [overBay]: arrayMove(bayContent[overBay], activeBayIndex, overBayIndex),
      }));
    }
    resizeStrip(overBay, stripId);
    setGroundStatus(overBay, stripId);
  }

  function handleDragStart(event: DragStartEvent) {
    const { active } = event;
    const stripId = active.id as string;

    setActiveStripId(stripId);
  }

  function resizeStrip(newBay, stripId) {
    if (newBay === "ARR" || newBay === "GMCAG") {
      setBayContent((prev: any) => ({
        ...prev,
        [newBay]: prev[newBay].map((strip: any) =>
          Object.values(strip).includes(stripId)
            ? { ...strip, size: "half" }
            : strip
        ),
      }));
    } else {
      setBayContent((prev: any) => ({
        ...prev,
        [newBay]: prev[newBay].map((strip: any) =>
          Object.values(strip).includes(stripId)
            ? { ...strip, size: "full" }
            : strip
        ),
      }));
    }
  }

  function setGroundStatus(newBay, stripId) {
    const strip: StripData = bayContent[newBay].find(
      (item: StripData) => item.id === stripId
    )!;

    const callsign: string = strip.fpdata.cs;

    if (newBay === "STUP") {
      fetch(`/api/set-ground-status?callsign=${callsign}&state=STUP`);
    } else if (newBay === "PUSH") {
      fetch(`/api/set-ground-status?callsign=${callsign}&state=PUSH`);
    } else if (newBay === "ACT") {
      fetch(`/api/set-ground-status?callsign=${callsign}&state=TAXI`);
    }
  }
}
