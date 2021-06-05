import { getBoundingRect, getRectRefLines, toNumber } from "../src/utils";
import { map } from "lodash";

function equalRectObject<C, T>(current: C, target: T) {
  Object.keys(target).forEach(key => {
    const c = current[key];
    const t = target[key];

    if (typeof c === "number" && typeof t === "number") {
      expect(c).toBeCloseTo(t);
      return;
    }

    expect(c).toEqual(t);
  });
}

describe("test getBoundingRect", () => {
  test("basic -1", () => {
    const rect1 = {
      key: "a",
      left: 0,
      top: 0,
      width: 100,
      height: 100,
    };
    expect(getBoundingRect(rect1)).toEqual({
      left: 0,
      top: 0,
      width: 100,
      height: 100,
      bottom: 100,
      right: 100,
    });
  });
  test("basic -1", () => {
    const rect1 = {
      key: "a",
      left: 100,
      top: 100,
      width: 100,
      height: 100,
    };
    expect(getBoundingRect(rect1)).toEqual({
      left: 100,
      top: 100,
      width: 100,
      height: 100,
      bottom: 200,
      right: 200,
    });
  });
  test("rotate 90", () => {
    const rect2 = {
      key: "a",
      left: 0,
      top: 0,
      width: 100,
      height: 100,
      rotate: 90,
    };
    expect(getBoundingRect(rect2)).toEqual({
      left: 0,
      top: 0,
      width: 100,
      height: 100,
      bottom: 100,
      right: 100,
    });
  });
  test("rotate 360", () => {
    const rect3 = {
      key: "a",
      left: 0,
      top: 0,
      width: 100,
      height: 100,
      rotate: 360,
    };
    expect(getBoundingRect(rect3)).toEqual({
      left: 0,
      top: 0,
      width: 100,
      height: 100,
      bottom: 100,
      right: 100,
    });
  });
  test("rotate 360 -1", () => {
    const rect4 = {
      key: "a",
      left: 0,
      top: 0,
      width: 200,
      height: 100,
      rotate: 360,
    };
    expect(getBoundingRect(rect4)).toEqual({
      left: 0,
      top: 0,
      width: 200,
      height: 100,
      bottom: 100,
      right: 200,
    });
  });
  test("rotate 90 - 200/100", () => {
    const rect5 = {
      key: "a",
      left: 0,
      top: 0,
      width: 200,
      height: 100,
      rotate: 90,
    };

    equalRectObject(getBoundingRect(rect5), {
      left: 50,
      top: -50,
      width: 100,
      height: 200,
      bottom: 150,
      right: 150,
    });
  });

  test("rotate 180 - 200/100", () => {
    const rect5 = {
      key: "a",
      left: 0,
      top: 0,
      width: 200,
      height: 100,
      rotate: 180,
    };

    equalRectObject(getBoundingRect(rect5), {
      left: 0,
      top: 0,
      width: 200,
      height: 100,
      right: 200,
      bottom: 100,
    });
  });

  test("rotate 270 - 200/100", () => {
    const rect5 = {
      key: "a",
      left: 0,
      top: 0,
      width: 200,
      height: 100,
      rotate: 270,
    };

    equalRectObject(getBoundingRect(rect5), {
      left: 50,
      top: -50,
      width: 100,
      height: 200,
      bottom: 150,
      right: 150,
    });
  });

  test("rotate 280 - 200/100", () => {
    const rect5 = {
      key: "a",
      left: 0,
      top: 0,
      width: 200,
      height: 100,
      rotate: 280,
    };

    equalRectObject(getBoundingRect(rect5), {
      left: 33.3947,
      top: -57.163,
      width: 133.21041,
      height: 214.3263,
      bottom: 157.163,
      right: 166.6052,
    });
  });
});

describe("test getRectRefLines", () => {
  test("basic -1", () => {
    const rect = {
      key: "a",
      left: 0,
      top: 0,
      width: 1,
      height: 1,
    };

    const lines = getRectRefLines(rect);

    const vLines = lines.filter(line => line.type === "vertical");
    const hLines = lines.filter(line => line.type === "horizontal");

    expect(vLines[0]).toMatchObject({
      type: "vertical",
      position: "vl",
      offset: 0,
      start: 0,
      end: 1,
    });
    expect(vLines[1]).toMatchObject({
      type: "vertical",
      position: "vc",
      offset: 0,
      start: 0,
      end: 1,
    });
    expect(vLines[2]).toMatchObject({
      type: "vertical",
      position: "vr",
      offset: 0,
      start: 0,
      end: 1,
    });

    expect(hLines[0]).toMatchObject({
      type: "horizontal",
      position: "ht",
      offset: 0,
      start: 0,
      end: 1,
    });
    expect(hLines[1]).toMatchObject({
      type: "horizontal",
      position: "hc",
      offset: 0,
      start: 0,
      end: 1,
    });
    expect(hLines[2]).toMatchObject({
      type: "horizontal",
      position: "hb",
      offset: 0,
      start: 0,
      end: 1,
    });
  });

  test("basic -2", () => {
    const rect = {
      key: "a",
      left: 0,
      top: 0,
      width: 100,
      height: 100,
    };

    const lines = getRectRefLines(rect);

    const vLines = lines.filter(line => line.type === "vertical");
    const hLines = lines.filter(line => line.type === "horizontal");

    expect(vLines[0]).toMatchObject({
      type: "vertical",
      position: "vl",
      offset: 0,
      start: 0,
      end: 100,
    });
    expect(vLines[1]).toMatchObject({
      type: "vertical",
      position: "vc",
      offset: 50,
      start: 0,

      end: 100,
    });
    expect(vLines[2]).toMatchObject({
      type: "vertical",
      position: "vr",
      offset: 100,
      start: 0,

      end: 100,
    });

    expect(hLines[0]).toMatchObject({
      type: "horizontal",
      position: "ht",
      offset: 0,
      start: 0,
      end: 100,
    });
    expect(hLines[1]).toMatchObject({
      type: "horizontal",
      position: "hc",
      offset: 50,
      start: 0,
      end: 100,
    });
    expect(hLines[2]).toMatchObject({
      type: "horizontal",
      position: "hb",
      offset: 100,
      start: 0,
      end: 100,
    });
  });

  test("rotate 90", () => {
    const rect = {
      key: "a",
      left: 0,
      top: 0,
      width: 200,
      height: 100,
      rotate: 90,
    };

    const lines = getRectRefLines(rect);

    const vLines = lines.filter(line => line.type === "vertical");
    const hLines = lines.filter(line => line.type === "horizontal");

    equalRectObject(vLines[0], {
      type: "vertical",
      position: "vl",
      offset: 50,
      start: -50,
      end: 150,
    });
    expect(vLines[1]).toMatchObject({
      type: "vertical",
      position: "vc",
      offset: 100,
      start: -50,

      end: 150,
    });
    expect(vLines[2]).toMatchObject({
      type: "vertical",
      position: "vr",
      offset: 150,
      start: -50,

      end: 150,
    });

    equalRectObject(hLines[0], {
      type: "horizontal",
      position: "ht",
      offset: -50,
      start: 50,

      end: 150,
    });
    equalRectObject(hLines[1], {
      type: "horizontal",
      position: "hc",
      offset: 50,
      start: 50,

      end: 150,
    });
    equalRectObject(hLines[2], {
      type: "horizontal",
      position: "hb",
      offset: 150,
      start: 50,

      end: 150,
    });
  });
});
