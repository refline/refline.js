import {
  LineType,
  Rect,
  RefLineMeta,
  BoundingRect,
  RefLinePosition,
  Delta,
  MOVE_DIR,
  MatchedLine,
} from "./types";

export function toNumber(v: number, numDigits = 0) {
  return +v.toFixed(numDigits);
}

export function deg2rad(deg: number) {
  return deg * (Math.PI / 180);
}

/**
 * 坐标系旋转变换函数
 * @param x 旋转前x坐标
 * @param y 旋转前y坐标
 * @param cx 旋转中心坐标x
 * @param cy 旋转中心坐标y
 * @param deg 旋转角度
 * @return [x2,y2]  返回旋转后的新坐标
 * @example: coordinateRotation(100,100, 150,150, 30)
 */
export function coordinateRotation(x: number, y: number, cx: number, cy: number, deg: number) {
  // 角度转弧度
  const rad = deg * (Math.PI / 180);
  // 转化相对中心点cx,cy的坐标
  const x1 = x - cx;
  const y1 = y - cy;

  // 旋转后相对中心点坐标
  const x2 = x1 * Math.cos(rad) - y1 * Math.sin(rad);
  const y2 = x1 * Math.sin(rad) + y1 * Math.cos(rad);

  // 还原回原始坐标系坐标
  return [x2 + cx, y2 + cy];
}

/**
 * 获取旋转矩形的坐标
 * @param rect
 */
export function getBoundingRectCoordinate(
  rect: Pick<Rect, "left" | "top" | "width" | "height" | "rotate">
): [number, number, number, number] {
  let { width, height, left, top, rotate = 0 } = rect;

  if (rotate % 360 === 0) {
    return [left, top, left + width, top + height];
  }

  const cx = left + width / 2;
  const cy = top + height / 2;

  const topLeft = coordinateRotation(left, top, cx, cy, rotate);
  const topRight = coordinateRotation(left + width, top, cx, cy, rotate);
  const bottomLeft = coordinateRotation(left, top + height, cx, cy, rotate);
  const bottomRight = coordinateRotation(left + width, top + height, cx, cy, rotate);

  const xX = [topLeft[0], topRight[0], bottomLeft[0], bottomRight[0]];
  const yY = [topLeft[1], topRight[1], bottomLeft[1], bottomRight[1]];

  const xMin = Math.min(...xX);
  const yMin = Math.min(...yY);
  const xMax = Math.max(...xX);
  const yMax = Math.max(...yY);

  return [xMin, yMin, xMax, yMax];
}

/**
 * 获取旋转后的坐标和宽高
 * @param rect
 */
export function getBoundingRect(
  rect: Pick<Rect, "left" | "top" | "width" | "height" | "rotate">
): BoundingRect {
  const coords = getBoundingRectCoordinate(rect);

  const xMin = coords[0];
  const yMin = coords[1];
  const xMax = coords[2];
  const yMax = coords[3];

  return {
    left: xMin,
    top: yMin,
    right: xMax,
    bottom: yMax,
    width: xMax - xMin,
    height: yMax - yMin,
  };
}

// 获取矩形6条参考线
// 左/中/右 及 上/中/下
export function getRectRefLines<T extends Rect = Rect>(rect: T): RefLineMeta<T>[] {
  const lines: RefLineMeta<T>[] = [];

  const boundingRect = getBoundingRect(rect);

  const width = boundingRect.width;
  const height = boundingRect.height;

  const mx = boundingRect.left + (width === 1 ? 0 : boundingRect.width / 2);
  const my = boundingRect.top + (height === 1 ? 0 : boundingRect.height / 2);

  return [
    {
      type: "vertical",
      position: "vl",
      offset: boundingRect.left,
      start: boundingRect.top,
      end: boundingRect.bottom,
      rect,
    },
    {
      type: "vertical",
      position: "vc",
      offset: mx,
      start: boundingRect.top,
      end: boundingRect.bottom,
      rect,
    },
    {
      type: "vertical",
      position: "vr",
      offset: width === 1 ? boundingRect.left : boundingRect.right,
      start: boundingRect.top,
      end: boundingRect.bottom,
      rect,
    },
    {
      type: "horizontal",
      position: "ht",
      offset: boundingRect.top,
      start: boundingRect.left,
      end: boundingRect.right,
      rect,
    },
    {
      type: "horizontal",
      position: "hc",
      offset: my,
      start: boundingRect.left,
      end: boundingRect.right,
      rect,
    },
    {
      type: "horizontal",
      position: "hb",
      offset: height === 1 ? boundingRect.top : boundingRect.bottom,
      start: boundingRect.left,
      end: boundingRect.right,
      rect,
    },
  ];
}

export function groupBy<T>(values: T[], getKey: (value: T) => string) {
  const keys: string[] = [];
  const group: Record<string, T[]> = Object.create(null);

  values.forEach(value => {
    const key = getKey(value);
    if (!group[key]) {
      group[key] = [];
      keys.push(key);
    }
    group[key].push(value);
  });

  return {
    group,
    keys,
  };
}

export function find<T>(values: T[], predicate: (value: T) => boolean) {
  for (let i = 0; i < values.length; i++) {
    if (predicate(values[i])) {
      return values[i];
    }
  }

  return null;
}

export function getLineTypeFromPosition(position: RefLinePosition): LineType {
  const map: Record<RefLinePosition, LineType> = {
    vl: "vertical",
    vc: "vertical",
    vr: "vertical",
    ht: "horizontal",
    hc: "horizontal",
    hb: "horizontal",
  };

  return map[position];
}

export function getMoveDir(delta: Delta) {
  if (delta.left > 0) {
    return MOVE_DIR.MOVE_LEFT;
  }
  if (delta.left < 0) {
    return MOVE_DIR.MOVE_RIGHT;
  }
  if (delta.top < 0) {
    return MOVE_DIR.MOVE_TOP;
  }
  if (delta.top > 0) {
    return MOVE_DIR.MOVE_BOTTOM;
  }

  return MOVE_DIR.NONE;
}

/**
 * 合并多条线段为完整的参考线
 * @param type
 * @param refLineMetaList
 * @param opts
 * @returns
 */
export function mergeRefLineMeta<T extends Rect>(
  type: LineType,
  refLineMetaList: RefLineMeta<T>[],
  opts?: {
    start?: number;
    end?: number;
  }
): MatchedLine<T> {
  const isVertical = type === "vertical";

  if (!refLineMetaList.length) {
    return {
      type,
      left: 0,
      top: 0,
      size: 0,
      refLineMetaList: [],
    };
  }

  const offset = refLineMetaList[0].offset;

  const start = Math.min(
    ...refLineMetaList.map(rLine => rLine.start),
    opts?.start == undefined ? Infinity : opts.start
  );
  const end = Math.max(
    ...refLineMetaList.map(rLine => rLine.end),
    opts?.end == undefined ? -Infinity : opts.end
  );

  const startPoint: [left: number, top: number] = isVertical ? [offset, start] : [start, offset];

  return {
    type,
    left: startPoint[0],
    top: startPoint[1],
    size: end - start,
    refLineMetaList: [...refLineMetaList],
  };
}

/**
 * 获取最终匹配的参考线
 * @param line
 * @param matched
 * @returns
 */
export function getMatchedLine<T extends Rect>(
  line: RefLineMeta<T>,
  matched: RefLineMeta<T>[]
): MatchedLine<T> | null {
  if (!matched.length) return null;

  const current = line.rect;
  const boundingRect = getBoundingRect(current);
  const isVertical = line.type === "vertical";

  const refLineMetaList = matched; //.filter(rLine => rLine.rect.key !== current.key);
  if (!refLineMetaList.length) return null;

  return mergeRefLineMeta(line.type, refLineMetaList, {
    start: isVertical ? boundingRect.top : boundingRect.left,
    end: isVertical ? boundingRect.bottom : boundingRect.right,
  });
}

export function isUndef(value: any) {
  return value === undefined;
}
