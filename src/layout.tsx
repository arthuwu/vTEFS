import { useState } from "react";
import Bay from "./bay";
import Strip from "./strip";
import "./index.css";
import { Bay as BayData, StripData } from "./types";
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
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";

const INITIAL_STRIPS: StripData[] = [
  {
    id: "CPA123",
    data: "hello world",
  },
  {
    id: "CPA1234",
    data: "hello world",
  },
  {
    id: "CPA1235",
    data: "hello world",
  },
  {
    id: "CPA2234",
    data: "hello world",
  },
];

export default function App() {
  const mouseSensor = useSensor(MouseSensor);
  const touchSensor = useSensor(TouchSensor);
  const keyboardSensor = useSensor(KeyboardSensor);

  const sensors = useSensors(mouseSensor, touchSensor, keyboardSensor);

  const [activeStripId, setActiveStripId] = useState<string | null>();
  const [bayContent, setBayContent] = useState({
    RDY: INITIAL_STRIPS,
    STUP: [],
    PUSH: [],
    ACT: [],
    ARR: [],
    GMCAG: [],
  });

  return (
    <div className="layout-page">
      <div className="layout-container">
        <DndContext
          autoScroll={false}
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragOver={handleDragOver}
          collisionDetection={closestCorners}
        >
          {/*{BAYS.map((bay) => {
            return <Bay key={bay.id} bay={bay} strips={bayContent[bay.id]} />;
          })}*/}
          <div className="layout-container gmc-amc-container">
            <div className="tl1">
              <Bay
                key={"RDY"}
                bay={{ id: "RDY", title: "CDC Ready to Start" }}
                strips={bayContent["RDY"]}
              />
            </div>
            <div className="tl2">
              <Bay
                key={"STUP"}
                bay={{ id: "STUP", title: "Startup" }}
                strips={bayContent["STUP"]}
              />
            </div>
            <div className="tl3">
              <Bay
                key={"PUSH"}
                bay={{ id: "PUSH", title: "Pushback" }}
                strips={bayContent["PUSH"]}
              />
            </div>
            <div className="tl4">
              <Bay
                key={"ACT"}
                bay={{ id: "ACT", title: "Active" }}
                strips={bayContent["ACT"]}
              />
            </div>
            <div className="tl5">
              <Bay
                key={"ARR"}
                bay={{ id: "ARR", title: "AMC Arrivals" }}
                strips={bayContent["ARR"]}
              />
            </div>
            <div className="tl6">
              <Bay
                key={"GMCAG"}
                bay={{ id: "GMCAG", title: "GMC Active" }}
                strips={bayContent["GMCAG"]}
              />
            </div>
          </div>
        </DndContext>
        <DragOverlay>
          {activeStripId ? (
            <Strip
              stripData={
                Object.values(bayContent)
                  .flat()
                  .find((obj) => Object.values(obj).includes(activeStripId))!
              }
            />
          ) : null}
        </DragOverlay>
        <div className="bottom-bar">
          <button onClick={createNewStrip}>Create new</button>
        </div>
      </div>
    </div>
  );

  function createNewStrip() {
    setBayContent((prev: any) => {
      return {
        ...prev,
        RDY: [...bayContent["RDY"], { id: "NEW", data: "hello world" }],
      };
    });
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

    setActiveStripId(null);
  }

  function handleDragStart(event: DragStartEvent) {
    const { active } = event;
    const stripId = active.id as string;

    setActiveStripId(stripId);
  }
}
