import "./index.css";
import "./strip.css";
import { StripData } from "./types";
import { useSortable } from "@dnd-kit/sortable";
import {
  useCallback,
  useState,
  useRef,
  ReactHTMLElement,
  useEffect,
} from "react";
import { DepStrip, DepStripPartial } from "./strips/dep-strip";
import { ArrStrip, ArrStripPartial } from "./strips/arr-strip";
import { BlkStrip, BlkStripPartial } from "./strips/blk-strip";
import { windowProps } from "./layout";
import {
  ReactSketchCanvas,
  type ReactSketchCanvasRef,
  CanvasPath,
} from "react-sketch-canvas";

type StripProps = {
  stripData: StripData;
  handleClick: () => void;
  windowProps: windowProps;
  drawingProps: any;
};

export type StripFunctionProps = {
  editATYP: () => void;
  editTWY: () => void;
  setFPCFlag: () => void;
  setCFlag: () => void;
  setTaxiFlag: () => void;
  setCftFlag: () => void;
  setCtlFlag: () => void;
  windowToggle: any;
  setWindowToggle: (any) => void;
};

export type StripHandleProps = {
  listeners: any;
  attributes: any;
};

export default function Strip({
  stripData,
  handleClick,
  windowProps,
  drawingProps,
}: StripProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging, over } =
    useSortable({
      id: stripData.id,
    });

  const stripRef = useRef<HTMLDivElement>(null);
  const [updateState, setUpdateState] = useState<boolean>(false); //temp before refactor

  const canvasRef = useRef<ReactSketchCanvasRef>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);

  const refs = useCallback(
    (node: HTMLDivElement | null) => {
      setNodeRef(node);
      stripRef.current = node;
    },
    [setNodeRef]
  );

  const style = transform
    ? {
        transform: `translate(${transform.x}px, ${transform.y}px)`,
      }
    : undefined;

  const stripHandle: StripHandleProps = {
    listeners,
    attributes,
  };

  const stripFunctions: StripFunctionProps = {
    editATYP: editATYP,
    editTWY: editTWY,
    setFPCFlag: setFPCFlag,
    setCftFlag: setCftFlag,
    setTaxiFlag: setTaxiFlag,
    setCtlFlag: setCtlFlag,
    setCFlag: setCFlag,
    windowToggle: windowProps.windowToggle,
    setWindowToggle: windowProps.setWindowToggle,
  };

  function editATYP() {}
  function editTWY() {}
  function setFPCFlag() {
    stripData["flagdata"].fpc_flag = stripData["flagdata"].fpc_flag
      ? false
      : true;
    setUpdateState(updateState ? false : true);
  }
  function setCFlag() {
    stripData["flagdata"].c_flag = stripData["flagdata"].c_flag ? false : true;
    setUpdateState(updateState ? false : true);
  }
  function setTaxiFlag() {
    stripData["flagdata"].t_flag = stripData["flagdata"].t_flag ? false : true;
    setUpdateState(updateState ? false : true);
  }
  function setCftFlag() {
    stripData["flagdata"].cft = stripData["flagdata"].cft ? false : true;
    setUpdateState(updateState ? false : true);
  }
  function setCtlFlag() {
    stripData["flagdata"].ctl = stripData["flagdata"].ctl ? false : true;
    setUpdateState(updateState ? false : true);
  }

  function toggleLeftIndent() {
    if (stripRef.current) {
      stripRef.current.classList.toggle("indented-left");
    }
  }

  function toggleRightIndent() {
    if (stripRef.current) {
      stripRef.current.classList.toggle("indented-right");
    }
  }

  function savePaths() {
    if (canvasRef.current) {
      async function fetchPaths() {
        const paths = await canvasRef.current!.exportPaths();
        stripData["canvas"] = paths;
      }

      fetchPaths();

      console.log("got to it");
      console.log(stripData["canvas"]);
    }
  }

  useEffect(() => {
    if (canvasContainerRef.current) {
      if (drawingProps.drawingInProgress) {
        canvasContainerRef.current.classList.add("enabled");
      } else {
        canvasContainerRef.current.classList.remove("enabled");
      }
    }

    if (canvasRef.current) {
      if (drawingProps.eraserMode) {
        canvasRef.current.eraseMode(true);
      } else {
        canvasRef.current.eraseMode(false);
      }
    }
  }, [drawingProps]);

  useEffect(() => {
    console.log("re-render");
    if (canvasRef.current) {
      if (stripData["canvas"]) {
        canvasRef.current.loadPaths(stripData["canvas"]);
      }
    }
  }, [isDragging]);

  if (isDragging) {
    if (over) {
      if (["ARR", "GMCAG"].includes(over!.id as string)) {
        return (
          <div className="dragging-preview-half">
            <div className="left-arrow"></div>
            <div className="middle-bar"></div>
            <div className="right-arrow"></div>
          </div>
        );
      } else {
        return (
          <div className="dragging-preview-full">
            <div className="left-arrow"></div>
            <div className="middle-bar"></div>
            <div className="right-arrow"></div>
          </div>
        );
      }
    }
  }

  if (stripData.type === "DEP") {
    return stripData.size === "full" ? (
      <div
        ref={refs}
        className="strip-container"
        style={style}
        onClick={handleClick}
      >
        <div ref={canvasContainerRef} className="canvas-container">
          <ReactSketchCanvas
            ref={canvasRef}
            strokeWidth={1}
            strokeColor={drawingProps.strokeColor}
            canvasColor={"#ffffff00"}
            onStroke={savePaths}
          />
        </div>
        <DepStrip
          stripData={stripData}
          stripFunctions={stripFunctions}
          stripHandle={stripHandle}
        />
        <button
          className="strip-toggle-indent-left"
          onClick={toggleLeftIndent}
        />
        <button
          className="strip-toggle-indent-right"
          onClick={toggleRightIndent}
        />
      </div>
    ) : (
      <div
        ref={refs}
        className="strip-container-partial"
        style={style}
        onClick={handleClick}
      >
        <DepStripPartial
          stripData={stripData}
          stripFunctions={stripFunctions}
          stripHandle={stripHandle}
        />
        <button
          className="strip-toggle-indent-left"
          onClick={toggleLeftIndent}
        />
        <button
          className="strip-toggle-indent-right"
          onClick={toggleRightIndent}
        />
      </div>
    );
  } else if (stripData.type === "ARR") {
    return stripData.size === "full" ? (
      <div
        ref={refs}
        className="strip-container"
        style={style}
        onClick={handleClick}
      >
        <ArrStrip
          stripData={stripData}
          stripFunctions={stripFunctions}
          stripHandle={stripHandle}
        />
        <button
          className="strip-toggle-indent-left"
          onClick={toggleLeftIndent}
        />
        <button
          className="strip-toggle-indent-right"
          onClick={toggleRightIndent}
        />
      </div>
    ) : (
      <div
        ref={refs}
        className="strip-container-partial"
        style={style}
        onClick={handleClick}
      >
        <ArrStripPartial
          stripData={stripData}
          stripFunctions={stripFunctions}
          stripHandle={stripHandle}
        />
        <button
          className="strip-toggle-indent-left"
          onClick={toggleLeftIndent}
        />
        <button
          className="strip-toggle-indent-right"
          onClick={toggleRightIndent}
        />
      </div>
    );
  } else if (stripData.type === "BLK") {
    return stripData.size === "full" ? (
      <div
        ref={refs}
        className="strip-container"
        style={style}
        onClick={handleClick}
      >
        <BlkStrip
          stripData={stripData}
          stripFunctions={stripFunctions}
          stripHandle={stripHandle}
        />
        <button
          className="strip-toggle-indent-left"
          onClick={toggleLeftIndent}
        />
        <button
          className="strip-toggle-indent-right"
          onClick={toggleRightIndent}
        />
      </div>
    ) : (
      <div
        ref={refs}
        className="strip-container-partial"
        style={style}
        onClick={handleClick}
      >
        <BlkStripPartial
          stripData={stripData}
          stripFunctions={stripFunctions}
          stripHandle={stripHandle}
        />
        <button
          className="strip-toggle-indent-left"
          onClick={toggleLeftIndent}
        />
        <button
          className="strip-toggle-indent-right"
          onClick={toggleRightIndent}
        />
      </div>
    );
  }
}
