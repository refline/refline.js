import { RefLine, Rect } from "../../src";
import React from "react";

interface Props {
  current: Rect;
  nodes: Rect[];
}
export default function Refline({ nodes, current }: Props) {
  if (!current) return null;

  const refline = new RefLine({
    rects: nodes,
    current,
    lineFilter: line => {
      if (line.position === "hc" || line.position === "vc") return false;
      return true;
    },
  });

  const lines = refline.getAllRefLines();

  return (
    <>
      {lines.map((line, i) => {
        return line.type === "vertical" ? (
          <div
            key={i}
            className="line"
            style={{
              left: line.left,
              top: line.top,
              width: 1,
              height: line.size,
              borderLeft: "1px dashed red",
            }}
          ></div>
        ) : (
          <div
            key={i}
            className="line"
            style={{
              left: line.left,
              top: line.top,
              height: 1,
              width: line.size,
              borderTop: "1px dashed red",
            }}
          ></div>
        );
      })}
    </>
  );
}
