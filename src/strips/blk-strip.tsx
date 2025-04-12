import "../index.css";
import "../strip.css";
import { StripFunctionProps, StripHandleProps } from "../strip";
import { StripData } from "../types";

type StripProps = {
  stripData: StripData;
  stripFunctions: StripFunctionProps;
  stripHandle: StripHandleProps;
};

export function BlkStrip({
  stripData,
  stripFunctions,
  stripHandle,
}: StripProps) {
  const { listeners, attributes } = stripHandle;

  return (
    <div className="inner-strip-container blk-background blk-container">
      <div {...listeners} {...attributes} className="blk-cs-container">
        <div>{stripData["fpdata"].cs}</div>
      </div>
    </div>
  );
}

export function BlkStripPartial({
  stripData,
  stripFunctions,
  stripHandle,
}: StripProps) {
  const { listeners, attributes } = stripHandle;
  return (
    <div className="inner-strip-container blk-background blk-partial-container">
      <div {...listeners} {...attributes} className="blk-cs-container">
        <div>{stripData["fpdata"].cs}</div>
      </div>
    </div>
  );
}
