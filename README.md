# refline.js

refline.js是完全不依赖设计器环境的参考线组件，方便各种设计器快速接入，支持参考线匹配及吸附功能。
## Install 

```cli
npm install refline.js
```

## Usage

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
  current: {
    key: 'b',
    left: 100,
    top: 100,
    width: 100,
    height: 100
  }
})

```

## RefLine

### constructor(opts: RefLineOpts)

构造函数

```ts
interface RefLineOpts<T extends Rect> {
    // 所有矩形列表
    rects: T[];
    // 当前检查的矩形，可通过setCurrent改变
    current?: T | string;
    // 参考线过滤，默认提供6条参考线(水平、垂直)，可通过该参数过滤不需要的参考线
    lineFilter?: (line: RefLineMeta) => boolean;
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
  distance?: number;
}

type Updater = (data: {
    pageX?: number;
    pageY?: number;
    current?: Rect;
    distance?: number;
}) => {
    delta: {
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
  distance: 5
})

const ret = updater({
  pageX: 105,
  pageY: 200
})

rect.left += ret.delta.left
rect.top += ret.delta.top

```

## Demo

[![Edit refline.js](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/reflinejs-7xnsd?fontsize=14&hidenavigation=1&theme=dark)
## Types

```ts
interface RefLineOpts<T extends Rect = Rect> {
    rects: T[];
    current?: T | string;
    lineFilter?: (line: RefLineMeta) => boolean;
}
declare class RefLine<T extends Rect = Rect> {
    protected __rects: T[];
    protected _rects: T[];
    protected current: null | T;
    protected _dirty: boolean;
    protected _vLines: LineGroup<T>[];
    protected _hLines: LineGroup<T>[];
    protected _vLineMap: Map<string, RefLineMeta<T>[]>;
    protected _hLineMap: Map<string, RefLineMeta<T>[]>;
    protected _adsorbLines: AdsorbLine[];
    protected _lineFilter: ((line: RefLineMeta) => boolean) | null;
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
    setLineFilter(filter: ((line: RefLineMeta) => boolean) | null): void;
    getLineFilter(): ((line: RefLineMeta<Rect>) => boolean) | null;
    protected toLineMapKey<S>(v: S): string;
    protected getLineMapKey(line: RefLineMeta<T>): string;
    protected isEnableLine(line: RefLineMeta<T>): boolean;
    protected getRectRefLines(rect: T): RefLineMeta<T>[];
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
    getVRefLines(): MatchedLine<T>[];
    getHRefLines(): MatchedLine<T>[];
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
    adsorbCreator({ pageX, pageY, current, distance, }: {
        pageX: number;
        pageY: number;
        current?: T | null;
        distance?: number;
    }): (data: {
        pageX?: number;
        pageY?: number;
        current?: T;
        distance?: number;
    }) => {
        delta: {
            left: number;
            top: number;
        };
        rect: T;
    };
}
declare function createRefLine<T extends Rect = Rect>(opts: RefLineOpts<T>): RefLine<T>;

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

文档及示例完善中...
