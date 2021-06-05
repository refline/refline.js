# refline.js

## Install 

```cli
npm install refline.js
```

## Usage

```ts
import { RefLine } from 'refline.js'

const refLine = new RefLine({
  rects: [...],
  current: {...}
})

```

## Demo

[![Edit refline.js](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/reflinejs-7xnsd?fontsize=14&hidenavigation=1&theme=dark)
## Types

```ts
interface RefLineOpts<T extends Rect> {
    rects: T[];
    current?: T | string;
}
declare class RefLine<T extends Rect> {
    protected __rects: T[];
    protected _rects: T[];
    protected current: null | T;
    protected _dirty: boolean;
    protected _vLines: LineGroup<T>[];
    protected _hLines: LineGroup<T>[];
    protected _vLineMap: Map<string, RefLineMeta<T>[]>;
    protected _hLineMap: Map<string, RefLineMeta<T>[]>;
    get rects(): T[];
    get vLines(): LineGroup<T>[];
    get hLines(): LineGroup<T>[];
    get vLineMap(): Map<string, RefLineMeta<T>[]>;
    get hLineMap(): Map<string, RefLineMeta<T>[]>;
    constructor(opts?: RefLineOpts<T>);
    getRectByKey(key: string | number): T | null;
    getOffsetRefLineMetaList(type: LineType, offset: number): RefLineMeta<T>[];
    setRects(rects: T[]): void;
    protected getRect(rect: T | string): T | null;
    setCurrent(current: T | string | null): void;
    getCurrent(): T | null;
    protected toLineMapKey<S>(v: S): string;
    protected getLineMapKey(line: RefLineMeta<T>): string;
    protected initRefLines(): void;
    /**
     * 匹配参考线
     * @param type
     * @param rect
     * @returns
     */
    matchRefLines(type: LineType): MatchedLine<T>[];
    /**
     * 给定offset(坐标x或y)的值，返回距离该offset的最近的两个offset(上下或左右)及距离
     * @param type
     * @param offset
     * @returns
     */
    getNearestOffsetFromOffset(type: LineType, offset: number): [[number, number] | null, [number, number] | null];
    hasMatchedRefLine(position: RefLinePosition): boolean;
    /**
     * alias getVRefLines
     * @returns
     */
    matchVRefLines(): MatchedLine<T>[];
    getVRefLines(): MatchedLine<T>[];
    /**
     * alias getHRefLines
     * @returns
     */
    matchHRefLines(): MatchedLine<T>[];
    getHRefLines(): MatchedLine<T>[];
    /**
     * alias getAllRefLines
     * @returns
     */
    matchAllRefLines(): MatchedLine<T>[];
    getAllRefLines(): MatchedLine<T>[];
    /**
     * 适配偏移量，达到吸附效果
     * @param type
     * @param offset
     * @param delta
     * @param adsorbDistance
     * @returns
     */
    getOffsetAdsorbDelta(type: LineType, offset: number, delta: number, adsorbDistance?: number): number;
    /**
     * 适配偏移量，达到吸附效果
     * @param delta
     * @param adsorbDistance
     * @returns
     */
    getAdsorbDelta(delta: Delta, adsorbDistance?: number): Delta;
}

interface Rect {
    key: string | number;
    left: number;
    top: number;
    width: number;
    height: number;
    rotate?: number;
    [x: string]: any;
}
interface BoundingRect {
    left: number;
    top: number;
    right: number;
    bottom: number;
    width: number;
    height: number;
}
declare type LineType = "horizontal" | "vertical";
declare type VRefLinePosition = "vl" | "vc" | "vr";
declare type HRefLinePosition = "ht" | "hc" | "hb";
declare type RefLinePosition = VRefLinePosition | HRefLinePosition;
interface RefLineMeta<T extends Rect = Rect> {
    type: LineType;
    position: RefLinePosition;
    offset: number;
    start: number;
    end: number;
    rect: T;
}
interface MatchedLine<T extends Rect = Rect> {
    type: LineType;
    left: number;
    top: number;
    size: number;
    refLineMetaList: RefLineMeta<T>[];
}
interface LineGroup<T extends Rect = Rect> {
    min: number;
    max: number;
    offset: number;
    refLineMetaList: RefLineMeta<T>[];
}
interface Delta {
    left: number;
    top: number;
}
declare enum MOVE_DIR {
    MOVE_TOP = 0,
    MOVE_RIGHT = 1,
    MOVE_BOTTOM = 2,
    MOVE_LEFT = 3,
    NONE = 4
}


```