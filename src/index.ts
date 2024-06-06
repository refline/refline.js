import {
  Rect,
  RefLineMeta,
  MatchedLine,
  LineType,
  LineGroup,
  RefLinePosition,
  Delta,
  AdsorbLine,
  AdsorbVLine,
  AdsorbHLine,
  Point,
} from "./types";
import {
  toNumber as fixNumber,
  getRectRefLines,
  getBoundingRect,
  groupBy,
  find,
  getLineTypeFromPosition,
  mergeRefLineMeta,
  getMatchedLine,
  coordinateRotation,
  isNil,
  createRectFromPoint,
} from "./utils";
export const version = "%VERSION%";

export * from "./types";

export { fixNumber, coordinateRotation, getBoundingRect, getRectRefLines, mergeRefLineMeta };

export interface RefLineOpts<T extends Rect = Rect> {
  rects?: T[];
  points?: Point[];
  current?: T | string;

  /**
   * 过滤矩形生成的吸附线，不包含自定义吸附线
   */
  lineFilter?: (line: RefLineMeta<T>) => boolean;
  /**
   * 自定义处理矩形生成的吸附线，不包含自定义吸附线
   */
  lineProcess?: (line: RefLineMeta<T>) => void
  // 自定义垂直吸附线
  adsorbVLines?: Omit<AdsorbLine, "type">[];
  // 自定义水平吸附线
  adsorbHLines?: Omit<AdsorbLine, "type">[];
  /**
   * 吸附匹配流程中对吸附线的过滤，包含所有线段
   */
  adsorbLineFilter?: (line: LineGroup<T>) => boolean;
}
export class RefLine<T extends Rect = Rect> {
  protected opts: Omit<RefLineOpts<T>, "rects" | "current"> = {};
  private seq: number = 1;
  protected __rects: T[] = [];
  protected _rects: T[] = [];
  protected current: null | T = null;
  protected _dirty: boolean = true;
  // 吸附用
  protected _vLines: LineGroup<T>[] = [];
  protected _hLines: LineGroup<T>[] = [];
  // 匹配用 offset : RefLineMeta
  protected _vLineMap: Map<string, RefLineMeta<T>[]> = new Map();
  protected _hLineMap: Map<string, RefLineMeta<T>[]> = new Map();
  // 自定义吸附线
  protected _adsorbVLines: AdsorbVLine[] = [];
  protected _adsorbHLines: AdsorbHLine[] = [];
  protected _lineFilter: ((line: RefLineMeta) => boolean) | null = null;
  protected _lineProcess: ((line: RefLineMeta) => void) | null = null

  get rects() {
    if (this._dirty) {
      this.initRefLines();
    }

    return this._rects;
  }

  /**
   * @deprecated
   * 会覆盖 points 属性
   */
  set rects(rects: T[]) {
    this.__rects = rects;

    this._dirty = true;
  }

  get vLines() {
    if (this._dirty) {
      this.initRefLines();
    }

    return this._vLines;
  }

  get hLines() {
    if (this._dirty) {
      this.initRefLines();
    }

    return this._hLines;
  }

  get vLineMap() {
    if (this._dirty) {
      this.initRefLines();
    }

    return this._vLineMap;
  }

  get hLineMap() {
    if (this._dirty) {
      this.initRefLines();
    }

    return this._hLineMap;
  }

  get adsorbVLines() {
    return this._adsorbVLines;
  }

  set adsorbVLines(lines: AdsorbVLine[]) {
    this._adsorbVLines = lines;

    this._dirty = true;
  }

  get adsorbHLines() {
    return this._adsorbHLines;
  }

  set adsorbHLines(lines: AdsorbHLine[]) {
    this._adsorbHLines = lines;

    this._dirty = true;
  }

  get adsorbLineFilter() {
    return this.opts.adsorbLineFilter;
  }

  constructor(opts?: RefLineOpts<T>) {
    this.opts = opts || {};
    this.__rects = opts?.rects || [];

    if (opts?.points) {
      opts.points.forEach((point) => {
        this.__rects.push(createRectFromPoint(point) as T);
      });
    }

    this._lineFilter = opts?.lineFilter || null;
    this._lineProcess = opts?.lineProcess || null;

    this._adsorbVLines = opts?.adsorbVLines || [];
    this._adsorbHLines = opts?.adsorbHLines || [];

    if (opts?.current) {
      this.setCurrent(opts.current);
    }

    this._dirty = true;
  }

  getRectByKey(key: string | number) {
    return find(this.__rects, (rect) => rect.key === key);
  }

  getOffsetRefLineMetaList(type: LineType, offset: number) {
    offset = fixNumber(offset, 0);
    const lineMap = type === "vertical" ? this.vLineMap : this.hLineMap;

    return lineMap.get(this.toLineMapKey(offset)) || [];
  }

  /**
   * @deprecated
   * 会覆盖 points 属性
   * @param rects
   */
  setRects(rects: T[]) {
    this.__rects = rects;
    this._dirty = true;
  }

  addPoint(point: Point) {
    const rect = createRectFromPoint(point);
    this.__rects.push(rect as T);

    this._dirty = true;

    return rect;
  }

  addRect(rect: T) {
    this.__rects.push(rect);

    this._dirty = true;

    return rect;
  }

  removeRect(key: string | number) {
    this.__rects = this.__rects.filter((rect) => rect.key !== key);
  }

  removePoint(key: string | number) {
    return this.removeRect(key);
  }

  protected getRect(rect: T | string): T | null {
    let current: T | null;
    if (typeof rect === "string") {
      current = this.getRectByKey(rect);
    } else {
      current = rect;
    }

    return current;
  }

  setCurrent(current: T | string | null) {
    const old = this.getCurrent();
    this.current = current ? this.getRect(current) : null;

    if (old?.key !== this.current?.key) {
      this._dirty = true;
    }
  }

  getCurrent() {
    return this.current;
  }

  setLineFilter(filter: ((line: RefLineMeta) => boolean) | null) {
    this._lineFilter = filter;
    this._dirty = true;
  }

  getLineFilter() {
    return this._lineFilter;
  }

  setLineProcess(process: ((line: RefLineMeta) => void) | null) {
    this._lineProcess = process;
    this._dirty = true;
  }

  getLineProcess() {
    return this._lineProcess;
  }

  protected toLineMapKey<S>(v: S) {
    return v + "";
  }

  protected getLineMapKey(line: { offset: number }) {
    return this.toLineMapKey(fixNumber(line.offset, 0));
  }

  protected isEnableLine(line: RefLineMeta<T>) {
    // 自定义吸附线不参与过滤
    if (line.adsorbOnly) return true;

    const filter = this.getLineFilter();
    if (filter) {
      return filter(line);
    }

    return true;
  }

  protected getRectRefLines(rect: T) {
    let lines = getRectRefLines(rect, {
      lineProcess: this.getLineProcess()
    });

    // const lineProcess = this.getLineProcess()
    // if (lineProcess) {
    //   lines.forEach(lineProcess);
    // }

    if (this.getLineFilter()) {
      lines = lines.filter((line) => this.isEnableLine(line));
    }

    return lines;
  }

  protected initRefLines() {
    const current = this.getCurrent();
    let vLines: RefLineMeta<T>[] = [];
    let hLines: RefLineMeta<T>[] = [];

    const reset = () => {
      this._vLines = [];
      this._hLines = [];
      this._vLineMap = new Map();
      this._hLineMap = new Map();
    };
    // 缓存重置
    reset();

    this._rects = current
      ? this.__rects.filter((rect) => rect.key !== current.key)
      : [...this.__rects];

    this._rects.forEach((rect) => {
      const lines = this.getRectRefLines(rect);

      lines.forEach((line) => {
        const mKey = this.getLineMapKey(line);
        if (line.type === "vertical") {
          vLines.push(line);
          const matched: RefLineMeta<T>[] = this._vLineMap.get(mKey) || [];
          matched.push(line);

          this._vLineMap.set(mKey, matched);
        } else {
          hLines.push(line);

          const matched: RefLineMeta<T>[] = this._hLineMap.get(mKey) || [];
          matched.push(line);

          this._hLineMap.set(mKey, matched);
        }
      });
    });

    // 添加自定义吸附线
    this._adsorbVLines.forEach((line) => {
      const refLineMeta: RefLineMeta<T> = {
        type: "vertical",
        position: "vl",
        offset: line.offset,
        start: line.offset,
        end: 0,
        rect: {
          key: "v_" + line.key,
          width: 0,
          height: 0,
          left: line.offset,
          top: 0,
        } as T,
        adsorbOnly: true,
        line,
      };
      vLines.push(refLineMeta);

      const mKey = this.getLineMapKey(line);
      const matched: RefLineMeta<T>[] = this._vLineMap.get(mKey) || [];
      matched.push(refLineMeta);

      this._vLineMap.set(mKey, matched);
    });
    this._adsorbHLines.forEach((line) => {
      const refLineMeta: RefLineMeta<T> = {
        type: "horizontal",
        position: "ht",
        offset: line.offset,
        start: line.offset,
        end: 0,
        rect: {
          key: "h_" + line.key,
          width: 0,
          height: 0,
          left: 0,
          top: line.offset,
        } as T,
        adsorbOnly: true,
        line,
      };
      hLines.push(refLineMeta);

      const mKey = this.getLineMapKey(line);
      const matched: RefLineMeta<T>[] = this._hLineMap.get(mKey) || [];
      matched.push(refLineMeta);

      this._hLineMap.set(mKey, matched);
    });

    vLines = vLines.sort((a, b) => a.offset - b.offset);
    hLines = hLines.sort((a, b) => a.offset - b.offset);

    let vGroup = groupBy(vLines, (line) => this.getLineMapKey(line));
    let hGroup = groupBy(hLines, (line) => this.getLineMapKey(line));

    this._vLines = vGroup.keys.map((key) => {
      const lines = vGroup.group[key];
      return {
        offset: fixNumber(lines[0].offset, 0),
        min: Math.min(...lines.map((line) => line.offset)),
        max: Math.max(...lines.map((line) => line.offset)),
        refLineMetaList: lines,
      };
    });

    this._hLines = hGroup.keys.map((key) => {
      const lines = hGroup.group[key];
      return {
        offset: fixNumber(lines[0].offset, 0),
        min: Math.min(...lines.map((line) => line.offset)),
        max: Math.max(...lines.map((line) => line.offset)),
        refLineMetaList: lines,
      };
    });

    this._dirty = false;
  }

  /**
   * 匹配参考线，主要用于显示
   * @param type
   * @param {boolean} [adsorbOnly=false] 是否仅获取自定义吸附线或排除自定义吸附线
   * @param rect
   * @returns
   */
  matchRefLines(type: LineType, adsorbOnly = false): MatchedLine<T>[] {
    const current = this.getCurrent();
    if (!current) return [];

    const isVertical = type === "vertical";
    const lineMap = isVertical ? this.vLineMap : this.hLineMap;

    const matchedLines: MatchedLine<T>[] = [];

    if (!current) return matchedLines;

    const cLines = this.getRectRefLines(current);

    cLines.forEach((line) => {
      if (line.type !== type) return;

      const mKey = this.getLineMapKey(line);

      const lines = lineMap.get(mKey) || [];

      const matchedLine = getMatchedLine(
        line,
        lines.filter((line) => (adsorbOnly ? line.adsorbOnly : !line.adsorbOnly)) // 过滤自定义吸附线
      );

      if (matchedLine) {
        matchedLines.push(matchedLine);
      }
    });

    return matchedLines;
  }

  /**
   * 给定offset(坐标x或y)的值，返回距离该offset的最近的两个offset(上下或左右)及距离
   * @param type
   * @param offset
   * @returns
   */
  getNearestOffsetFromOffset(
    type: LineType,
    offset: number
  ): [[number, number] | null, [number, number] | null] {
    const isVertical = type === "vertical";
    const lines = isVertical ? this.vLines : this.hLines;

    let prev: number = -Infinity;
    let prevDist: number = Infinity;
    let next: number = Infinity;
    let nextDist: number = Infinity;

    lines.forEach((line) => {
      if (this.adsorbLineFilter && !this.adsorbLineFilter(line)) {
        return;
      }

      const d = Math.abs(line.min - offset);
      if (line.min < offset && d >= 0.5) {
        prev = Math.max(line.min, prev);
        prevDist = Math.min(d, prevDist);
      }

      if (line.min > offset && d >= 0.5) {
        next = Math.min(line.min, next);
        nextDist = Math.min(d, nextDist);
      }
    });

    return [
      prev !== -Infinity ? [prev, prevDist] : null,
      next !== Infinity ? [next, nextDist] : null,
    ];
  }
  /**
   * 指定当前矩形需要检查的参考线，判断是否存在匹配，包括自定义吸附线
   * @param position
   * @returns
   */
  hasMatchedRefLine(position: RefLinePosition) {
    const current = this.getCurrent();
    if (!current) return false;

    const lines = this.getRectRefLines(current);
    const line = find(lines, (line) => line.position === position);

    if (!line) return false;
    const mKey = this.getLineMapKey(line);

    const lineMap =
      getLineTypeFromPosition(position) === "vertical" ? this.vLineMap : this.hLineMap;

    const matched = lineMap.get(mKey);

    if (!matched) return false;

    return !!matched.length;
  }

  /**
   * alias getVRefLines
   * @returns
   */
  matchVRefLines() {
    return this.matchRefLines("vertical");
  }

  /**
   * 返回当前矩形匹配到的垂直参考线
   * 注：不包括自定义吸附参考线，既：adsorbVLines
   * @returns
   */
  getVRefLines() {
    return this.matchRefLines("vertical");
  }

  /**
   * alias getHRefLines
   * @returns
   */
  matchHRefLines() {
    return this.matchRefLines("horizontal");
  }

  /**
   * 返回当前矩形匹配到的水平参考线
   * 注：不包括自定义吸附参考线，既：adsorbHLines
   * @returns
   */
  getHRefLines() {
    return this.matchRefLines("horizontal");
  }

  /**
   * alias getAllRefLines
   * @returns
   */
  matchAllRefLines() {
    return [...this.matchVRefLines(), ...this.matchHRefLines()];
  }

  /**
   * 返回当前矩形匹配到的 水平、垂直参考线
   * 注：不包括自定义吸附参考线，既：adsorbVLines、adsorbHLines
   * @returns
   */
  getAllRefLines() {
    return [...this.matchVRefLines(), ...this.matchHRefLines()];
  }
  /**
   * 返回当前矩形匹配到的自定义水平参考线
   * @returns
   */
  getAdsorbHRefLines() {
    return this.matchRefLines("horizontal", true);
  }
  /**
   * 返回当前矩形匹配到的自定义垂直参考线
   * @returns
   */
  getAdsorbVRefLines() {
    return this.matchRefLines("vertical", true);
  }
  /**
   * 返回当前矩形匹配到的自定义水平、垂直参考线
   * @returns
   */
  getAllAdsorbRefLines() {
    return [...this.getAdsorbVRefLines(), ...this.getAdsorbHRefLines()];
  }

  /**
   * 适配偏移量，达到吸附效果
   * @param type
   * @param offset
   * @param delta
   * @param adsorbDistance
   * @returns
   */
  getOffsetAdsorbDelta(type: LineType, offset: number, delta: number, adsorbDistance = 5) {
    adsorbDistance = Math.abs(adsorbDistance);

    if (adsorbDistance < 1) return delta;

    const hasMatchedLine = this.getOffsetRefLineMetaList(type, offset).length;

    const n = this.getNearestOffsetFromOffset(type, offset);

    const isMoveTopOrLeft = delta < 0;

    const useIndex = isMoveTopOrLeft ? 0 : 1;
    const nearestOffset = n[useIndex];

    const value: number = nearestOffset ? nearestOffset[0] : 0;
    const dist: number = nearestOffset ? nearestOffset[1] : 0;

    if (nearestOffset && dist <= adsorbDistance) {
      adsorbDistance = dist;
    } else {
      adsorbDistance += 1;
    }

    if (hasMatchedLine) {
      if (Math.abs(delta) < adsorbDistance) {
        delta = 0;
      } else if (Math.abs(delta) === 1 && adsorbDistance < 1) {
        delta = adsorbDistance;
      }
    } else if (delta !== 0) {
      const dist = value - (offset + delta);

      if (Math.abs(dist) < adsorbDistance && (isMoveTopOrLeft ? dist <= 0 : dist >= 0)) {
        delta += dist;
      }
    }

    return delta;
  }

  /**
   * 适配偏移量，达到吸附效果
   * @param delta
   * @param adsorbDistance
   * @returns
   */
  getAdsorbDelta(
    delta: Delta,
    adsorbDistance: number,
    dir: {
      x: "left" | "right" | "none";
      y: "up" | "down" | "none";
    }
  ): Delta {
    const rect = this.getCurrent();
    if (!rect) return delta;

    const dirX = dir?.x || "none";
    const dirY = dir?.y || "none";

    adsorbDistance = Math.abs(adsorbDistance || 5);
    const origAdsorbDistance = adsorbDistance;

    const newDelta = {
      ...delta,
    };

    if (adsorbDistance < 1) return newDelta;

    const refLineMetaList = getRectRefLines(rect, {
      lineProcess: this.getLineProcess()
    });
    const lineStatus = [
      this.isEnableLine(refLineMetaList[0]),
      this.isEnableLine(refLineMetaList[1]),
      this.isEnableLine(refLineMetaList[2]),
      this.isEnableLine(refLineMetaList[3]),
      this.isEnableLine(refLineMetaList[4]),
      this.isEnableLine(refLineMetaList[5]),
    ];

    const hasMatchedVRefLine =
      this.hasMatchedRefLine("vl") || this.hasMatchedRefLine("vc") || this.hasMatchedRefLine("vr");

    const hasMatchedHRefLine =
      this.hasMatchedRefLine("ht") || this.hasMatchedRefLine("hc") || this.hasMatchedRefLine("hb");

    if (delta.left !== 0 && dirX !== "none") {
      adsorbDistance = origAdsorbDistance;
      const currentOffsetList = [
        refLineMetaList[0].offset,
        refLineMetaList[1].offset,
        refLineMetaList[2].offset,
      ];
      const n1 = this.getNearestOffsetFromOffset("vertical", refLineMetaList[0].offset);
      const n2 = this.getNearestOffsetFromOffset("vertical", refLineMetaList[1].offset);
      const n3 = this.getNearestOffsetFromOffset("vertical", refLineMetaList[2].offset);

      const isMoveLeft = dirX === "left";

      const values: number[] = [Infinity, Infinity, Infinity];
      const distValues: number[] = [Infinity, Infinity, Infinity];
      const useIndex = isMoveLeft ? 0 : 1;
      if (lineStatus[0] && n1[useIndex]) {
        values[0] = n1[useIndex]![0];
        distValues[0] = n1[useIndex]![1];
      }
      if (lineStatus[1] && n2[useIndex]) {
        values[1] = n2[useIndex]![0];
        distValues[1] = n2[useIndex]![1];
      }
      if (lineStatus[2] && n3[useIndex]) {
        values[2] = n3[useIndex]![0];
        distValues[2] = n3[useIndex]![1];
      }
      const minDist = Math.min(...distValues);
      const minIndex = distValues.indexOf(minDist);
      const minOffset = values[minIndex];

      if (minDist <= adsorbDistance) {
        adsorbDistance = minDist;
      } else {
        adsorbDistance += 1;
      }

      if (hasMatchedVRefLine) {
        if (isMoveLeft && delta.left > 0) {
          newDelta.left = 0;
        } else if (!isMoveLeft && delta.left < 0) {
          newDelta.left = 0;
        } else if (Math.abs(delta.left) < adsorbDistance) {
          newDelta.left = 0;
        }
      } else {
        const currentOffset = currentOffsetList[minIndex];
        const dist = minOffset - (currentOffset + delta.left);

        if (isMoveLeft && delta.left > 0) {
          newDelta.left = 0;
        } else if (!isMoveLeft && delta.left < 0) {
          newDelta.left = 0;
        } else if (Math.abs(dist) < adsorbDistance && (isMoveLeft ? dist <= 0 : dist >= 0)) {
          newDelta.left = dist + delta.left;
        }
      }
    }

    if (delta.top !== 0 && dirY !== "none") {
      adsorbDistance = origAdsorbDistance;
      const currentOffsetList = [
        refLineMetaList[3].offset,
        refLineMetaList[4].offset,
        refLineMetaList[5].offset,
      ];
      const n1 = this.getNearestOffsetFromOffset("horizontal", refLineMetaList[3].offset);
      const n2 = this.getNearestOffsetFromOffset("horizontal", refLineMetaList[4].offset);
      const n3 = this.getNearestOffsetFromOffset("horizontal", refLineMetaList[5].offset);

      const isMoveTop = dirY === "up";

      const values: number[] = [Infinity, Infinity, Infinity];
      const distValues: number[] = [Infinity, Infinity, Infinity];
      const useIndex = isMoveTop ? 0 : 1;
      if (lineStatus[3] && n1[useIndex]) {
        values[0] = n1[useIndex]![0];
        distValues[0] = n1[useIndex]![1];
      }
      if (lineStatus[4] && n2[useIndex]) {
        values[1] = n2[useIndex]![0];
        distValues[1] = n2[useIndex]![1];
      }
      if (lineStatus[5] && n3[useIndex]) {
        values[2] = n3[useIndex]![0];
        distValues[2] = n3[useIndex]![1];
      }
      const minDist = Math.min(...distValues);
      const minIndex = distValues.indexOf(minDist);
      const minOffset = values[minIndex];

      if (minDist <= adsorbDistance) {
        adsorbDistance = minDist;
      } else {
        adsorbDistance += 1;
      }

      if (hasMatchedHRefLine) {
        if (isMoveTop && delta.top > 0) {
          newDelta.top = 0;
        } else if (!isMoveTop && delta.top < 0) {
          newDelta.top = 0;
        } else if (Math.abs(delta.top) < adsorbDistance) {
          newDelta.top = 0;
        }
      } else {
        const currentOffset = currentOffsetList[minIndex];
        const dist = minOffset - (currentOffset + delta.top);

        if (isMoveTop && delta.top > 0) {
          newDelta.top = 0;
        } else if (!isMoveTop && delta.top < 0) {
          newDelta.top = 0;
        } else if (Math.abs(dist) < adsorbDistance && (isMoveTop ? dist <= 0 : dist >= 0)) {
          newDelta.top = dist + delta.top;
        }
      }
    }

    return newDelta;
  }

  adsorbCreator({
    pageX,
    pageY,
    current = this.getCurrent(),
    point,
    distance = 5,
    disableAdsorb = false,
    scale,
  }: {
    pageX: number;
    pageY: number;
    current?: T | null;
    /**
     * 优先级高于 current
     */
    point?: Point;
    distance?: number;
    disableAdsorb?: boolean;
    scale?: number;
  }) {
    if (point) {
      current = createRectFromPoint(point) as T;
    }

    if (!current) {
      throw new Error("[refline.js] current rect does not exist!");
    }

    let currentRect: T = {
      ...current,
    };
    const startX = pageX;
    const startY = pageY;
    const startLeft = currentRect.left;
    const startTop = currentRect.top;
    const _scale = scale || 1;
    const defaultDisableAdsorb = disableAdsorb;

    // 记录上次坐标，如果相同则偏移量返回0，修复吸附后重复计算导致结果不一致问题
    let lastX = pageX;
    let lastY = pageY;
    let lastDirX, lastDirY;

    return (data: {
      pageX?: number;
      pageY?: number;
      current?: T;
      point?: Point;
      distance?: number;
      disableAdsorb?: boolean;
      scale?: number;
      // 设置距离起始坐标偏移量，设置后相应的pageX或pageY及scale会失效
      offsetX?: number;
      offsetY?: number;
    }) => {
      let disableAdsorb = defaultDisableAdsorb;
      if (data.current) {
        currentRect = {
          ...data.current,
        };
      }

      if (point) {
        currentRect = createRectFromPoint(point) as T;
      }

      if (!isNil(data.distance)) {
        distance = data.distance as number;
      }

      if (!isNil(data.disableAdsorb)) {
        disableAdsorb = data.disableAdsorb as boolean;
      }

      const currentX = isNil(data.pageX) ? startX : (data.pageX as number);
      const currentY = isNil(data.pageY) ? startY : (data.pageY as number);
      const scale = isNil(data.scale) ? _scale : (data.scale as number);
      const dir = {
        x: "none",
        y: "none",
      } as {
        x: "left" | "right" | "none";
        y: "up" | "down" | "none";
      };

      if (!isNil(data.pageX)) {
        if (currentX === lastX) {
          dir.x = lastDirX;
        } else {
          dir.x = currentX < lastX ? "left" : "right";
        }

        lastDirX = dir.x;
      }
      if (!isNil(data.pageY)) {
        if (currentY === lastY) {
          dir.y = lastDirY;
        } else {
          dir.y = currentY < lastY ? "up" : "down";
        }

        lastDirY = dir.y;
      }

      const offsetX = isNil(data.offsetX) ? (currentX - startX) / scale : (data.offsetX as number);
      const offsetY = isNil(data.offsetY) ? (currentY - startY) / scale : (data.offsetY as number);

      const left = startLeft + offsetX;
      const top = startTop + offsetY;

      let delta = {
        left: left - currentRect.left,
        top: top - currentRect.top,
      };

      if (!isNil(data.pageX) && currentX === lastX) {
        delta.left = 0;
      }

      if (!isNil(data.pageY) && currentY === lastY) {
        delta.top = 0;
      }

      if (!isNil(data.pageX) && !isNil(data.pageY) && currentX === lastX && currentY === lastY) {
        disableAdsorb = true;
      }

      const raw = delta;

      if (!disableAdsorb) {
        this.setCurrent(currentRect);
        delta = this.getAdsorbDelta(delta, distance || 5, dir);
      }

      currentRect.left += delta.left;
      currentRect.top += delta.top;

      lastX = currentX;
      lastY = currentY;

      return {
        raw,
        delta,
        offset: {
          left: currentRect.left - startLeft,
          top: currentRect.top - startTop,
        },
        rect: {
          ...currentRect,
        },
      };
    };
  }
}

export function createRefLine<T extends Rect = Rect>(opts: RefLineOpts<T>) {
  return new RefLine(opts);
}

export default RefLine;
