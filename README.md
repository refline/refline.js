# refline.js

refline.js是完全不依赖设计器环境的参考线组件，方便各种设计器快速接入，支持参考线匹配及吸附功能。

![refline.js](https://oscimg.oschina.net/oscnet/up-7ecfc44ff4bf6ce3497f69ea4a20fc2fd48.gif)

## 示例

[![Edit refline.js](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/reflinejs-7xnsd?fontsize=14&hidenavigation=1&theme=dark)
## 安装 

```cli
npm install refline.js
```

## 使用

```ts
import { RefLine } from 'refline.js'

const refLine = new RefLine({
  rects: [{
    key: 'a',
    left: 100,
    top: 100,
    width: 400,
    height: 800
  }],
  points: [{
    x: 300,
    y: 300
  }],
  current: {
    key: 'b',
    left: 100,
    top: 100,
    width: 100,
    height: 100
  }
})

// 匹配参考线
const lines = refLine.getAllRefLines()

// 拖拽下参考线吸附
// mousedown
const updater = refLine.adsorbCreator({
  pageX: 100,
  pageY: 100,
})
// mousemove
const {delta} = updater({
  pageX: 108,
  pageY: 110,
})

// TODO.

```

---

## createRefLine(opts: RefLineOpts): RefLine

创建 `RefLine` 实例

## RefLine

### constructor(opts: RefLineOpts)

构造函数

```ts
interface RefLineOpts<T extends Rect> {
    // 所有矩形列表
    rects?: T[];
    // 设置单个吸附点
    points?: Point;
    // 当前检查的矩形，可通过setCurrent改变
    current?: T | string;
    // 参考线过滤，默认提供6条参考线(水平、垂直)，可通过该参数过滤不需要的参考线
    lineFilter?: (line: RefLineMeta) => boolean;
    /**
     * 自定义处理矩形生成的吸附线，不包含自定义吸附线
     */
    lineProcess?: (line: RefLineMeta<T>) => void
    // 自定义垂直吸附线
    adsorbVLines?: Array<{key: string; offset: number}>;
    // 自定义水平吸附线
    adsorbHLines?: Array<{key: string; offset: number}>;
    /**
     * 吸附匹配流程中对吸附线的过滤，包含所有线段
     */
    adsorbLineFilter?: (line: LineGroup) => boolean;
}
```

### setCurrent(current)

设置当前需要检查的矩形

```ts
const refLine = new RefLine({...});
refLine.setCurrent({
  key: 'b',
  left: 100,
  top: 100,
  width: 100,
  height: 100
})

// 获取匹配到的垂直辅助线
refLine.getVRefLines()

```

### setLineFilter(filter)

更新`lineFilter`

### getVRefLines(): MatchedLine[]

获取匹配到的垂直参考线，返回一个参考线列表，为匹配到时返回一个`空数组`

```ts
interface MatchedLine{
  // 匹配后辅助线的类型
  type: "horizontal" | "vertical";
  // 辅助线相对矩形所在容器的坐标 x
  left: number;
  // 辅助线相对矩形所在容器的坐标 y
  top: number;
  // 辅助线高度(相对水平辅助线就是宽度)
  size: number;
  // 匹配到的矩形列表元信息
  refLineMetaList: RefLineMeta[];
}
```

### getHRefLines(): MatchedLine[]

获取匹配到的水平参考线，返回一个参考线列表，为匹配到时返回一个`空数组`

### getAllRefLines(): MatchedLine[]

获取匹配到的水平参考线及垂直参考线

### getAdsorbDelta()

给定当前的偏移量进行吸附偏移量计算，如果有吸附返回一个新的偏移量，如果无吸附则返回当前偏移量。

### adsorbCreator(IOpts): Updater

根据给定坐标，创建吸附偏移量生成器，将新坐标传进生成器后可获得计算后的偏移量

```ts
interface IOpts{
  pageX: number;
  pageY: number;
  current?: Rect;
   /**
    * 优先级高于 current
    */
  point?: Point;
  distance?: number;
  // 禁用吸附计算
  disableAdsorb?: boolean;
  // 当前视图缩放比例，默认为：1
  scale?: number;
}

**注:** `scale`的作用仅仅用于计算缩放后拖拽距离

type Updater = (data: {
    pageX?: number;
    pageY?: number;
    current?: Rect;
     /**
      * 优先级高于 current
      */
    point?: Point;
    distance?: number;
    // 禁用吸附计算
    disableAdsorb?: boolean;
    // 更新当前视图缩放比例，默认为：1
    scale?: number;
    // 设置距离起始坐标偏移量，设置后相应的pageX或pageY及scale会失效
    offsetX?: number;
    offsetY?: number;
}) => {
    // 拖动原始偏移量
    raw: {
      left: number;
      top: number;
    };
    // 拖动时吸附产生的偏移量，无吸附的情况下delta和raw是相等的
    delta: {
      left: number;
      top: number;
    };
    // 相对初始pageX/pageY的偏移量
    offset: {
      left: number;
      top: number;
    };
    rect: Rect;
}
```

使用示例：

```ts

const refLine = new RefLine({...})

const updater = refLine.adsorbCreator({
  current: rect,
  pageX: 100,
  pageY: 100,
  distance: 5,
  scale: 1
})

const ret = updater({
  pageX: 105,
  pageY: 200
})

rect.left += ret.delta.left
rect.top += ret.delta.top

```

## Interfaces

```ts
export interface RefLineOpts<T extends Rect = Rect> {
    rects?: T[];
    points?: Point[];
    current?: T | string;
    /**
     * 过滤矩形生成的吸附线，不包含自定义吸附线
     */
    lineFilter?: (line: RefLineMeta<T>) => boolean;
    adsorbVLines?: Omit<AdsorbLine, "type">[];
    adsorbHLines?: Omit<AdsorbLine, "type">[];
    /**
     * 吸附匹配流程中对吸附线的过滤，包含所有线段
     */
    adsorbLineFilter?: (line: LineGroup<T>) => boolean;
}
export declare class RefLine<T extends Rect = Rect> {
    get rects(): T[];
    get vLines(): LineGroup<T>[];
    get hLines(): LineGroup<T>[];
    get vLineMap(): Map<string, RefLineMeta<T>[]>;
    get hLineMap(): Map<string, RefLineMeta<T>[]>;
    get adsorbVLines(): AdsorbVLine[];
    set adsorbVLines(lines: AdsorbVLine[]);
    get adsorbHLines(): AdsorbHLine[];
    set adsorbHLines(lines: AdsorbHLine[]);
    get adsorbLineFilter(): ((line: LineGroup<T>) => boolean) | undefined;
    constructor(opts?: RefLineOpts<T>);
    getRectByKey(key: string | number): T | null;
    getOffsetRefLineMetaList(type: LineType, offset: number): RefLineMeta<T>[];
    addPoint(point: Point): Rect;
    addRect(rect: T): T;
    removeRect(key: string | number): void;
    removePoint(key: string | number): void;
    setCurrent(current: T | string | null): void;
    getCurrent(): T | null;
    setLineFilter(filter: ((line: RefLineMeta) => boolean) | null): void;
    getLineFilter(): ((line: RefLineMeta<Rect>) => boolean) | null;
    setLineProcess(process: ((line: RefLineMeta) => void) | null): void
    getLineProcess(): ((line: RefLineMeta) => void) | null
    /**
     * 匹配参考线，主要用于显示
     * @param type
     * @param {boolean} [adsorbOnly=false] 是否仅获取自定义吸附线或排除自定义吸附线
     * @param rect
     * @returns
     */
    matchRefLines(type: LineType, adsorbOnly?: boolean): MatchedLine<T>[];
    /**
     * 给定offset(坐标x或y)的值，返回距离该offset的最近的两个offset(上下或左右)及距离
     * @param type
     * @param offset
     * @returns
     */
    getNearestOffsetFromOffset(type: LineType, offset: number): [[number, number] | null, [number, number] | null];
    /**
     * 指定当前矩形需要检查的参考线，判断是否存在匹配，包括自定义吸附线
     * @param position
     * @returns
     */
    hasMatchedRefLine(position: RefLinePosition): boolean;
    /**
     * alias getVRefLines
     * @returns
     */
    matchVRefLines(): MatchedLine<T>[];
    /**
     * 返回当前矩形匹配到的垂直参考线
     * 注：不包括自定义吸附参考线，既：adsorbVLines
     * @returns
     */
    getVRefLines(): MatchedLine<T>[];
    /**
     * alias getHRefLines
     * @returns
     */
    matchHRefLines(): MatchedLine<T>[];
    /**
     * 返回当前矩形匹配到的水平参考线
     * 注：不包括自定义吸附参考线，既：adsorbHLines
     * @returns
     */
    getHRefLines(): MatchedLine<T>[];
    /**
     * alias getAllRefLines
     * @returns
     */
    matchAllRefLines(): MatchedLine<T>[];
    /**
     * 返回当前矩形匹配到的 水平、垂直参考线
     * 注：不包括自定义吸附参考线，既：adsorbVLines、adsorbHLines
     * @returns
     */
    getAllRefLines(): MatchedLine<T>[];
    /**
     * 返回当前矩形匹配到的自定义水平参考线
     * @returns
     */
    getAdsorbHRefLines(): MatchedLine<T>[];
    /**
     * 返回当前矩形匹配到的自定义垂直参考线
     * @returns
     */
    getAdsorbVRefLines(): MatchedLine<T>[];
    /**
     * 返回当前矩形匹配到的自定义水平、垂直参考线
     * @returns
     */
    getAllAdsorbRefLines(): MatchedLine<T>[];
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
    getAdsorbDelta(delta: Delta, adsorbDistance: number, dir: {
        x: "left" | "right" | "none";
        y: "up" | "down" | "none";
    }): Delta;
    adsorbCreator({ pageX, pageY, current, point, distance, disableAdsorb, scale, }: {
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
    }): (data: {
        pageX?: number;
        pageY?: number;
        current?: T;
        point?: Point;
        distance?: number;
        disableAdsorb?: boolean;
        scale?: number;
        offsetX?: number;
        offsetY?: number;
    }) => {
        raw: {
            left: number;
            top: number;
        };
        delta: {
            left: number;
            top: number;
        };
        offset: {
            left: number;
            top: number;
        };
        rect: T;
    };
}
export declare function createRefLine<T extends Rect = Rect>(opts: RefLineOpts<T>): RefLine<T>;
export default RefLine;

export interface Rect {
  key: string | number;
  left: number;
  top: number;
  width: number;
  height: number;
  rotate?: number;
  [x: string]: any;
}

export interface BoundingRect {
  left: number;
  top: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
}

export type LineType = "horizontal" | "vertical";

// horizontal/vertical  top/center/bottom left/center/right
export type VRefLinePosition = "vl" | "vc" | "vr";
export type HRefLinePosition = "ht" | "hc" | "hb";
export type RefLinePosition = VRefLinePosition | HRefLinePosition;
export interface AdsorbLine {
  key: string;
  type: LineType;
  offset: number;
}

export type AdsorbVLine = Omit<AdsorbLine, "type">;
export type AdsorbHLine = Omit<AdsorbLine, "type">;
export interface RefLineMeta<T extends Rect = Rect> {
  type: LineType;
  position: RefLinePosition;
  offset: number;
  start: number;
  end: number;
  rect: T;
  adsorbOnly?: boolean;
  /**
   * 当匹配到的是自定义吸附线
   */
  line?: AdsorbVLine | AdsorbVLine;
}

export interface MatchedLine<T extends Rect = Rect> {
  type: LineType;
  left: number;
  top: number;
  size: number;
  refLineMetaList: RefLineMeta<T>[];
}

export interface LineGroup<T extends Rect = Rect> {
  min: number;
  max: number;
  offset: number;
  refLineMetaList: RefLineMeta<T>[];
}

export interface Delta {
  left: number;
  top: number;
}

export enum MOVE_DIR {
  MOVE_TOP,
  MOVE_RIGHT,
  MOVE_BOTTOM,
  MOVE_LEFT,
  NONE,
}

export interface Point {
  key?: string | number;
  x: number;
  y: number;
}

```
