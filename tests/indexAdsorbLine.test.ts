import { RefLine } from "../src";

describe("test RefLine::Opts - adsorbVLines/adsorbHLines", () => {
  test("basic - 1", () => {
    const rects = [
      {
        key: "a",
        left: 0,
        top: 0,
        width: 100,
        height: 100,
      },

      {
        key: "b",
        left: 600,
        top: 600,
        width: 100,
        height: 100,
      },
      {
        key: "c",
        left: 200,
        top: 200,
        width: 200,
        height: 200,
      },
    ];
    const refLine = new RefLine({
      rects,
      adsorbVLines: [
        {
          key: "a",
          offset: 25,
        },
      ],
      adsorbHLines: [
        {
          key: "a",
          offset: 25,
        },
      ],
    });

    expect(refLine.vLines.length).toEqual(10);
    expect(refLine.vLineMap.size).toEqual(10);
    expect(refLine.hLines.length).toEqual(10);
    expect(refLine.hLineMap.size).toEqual(10);

    refLine.setCurrent({
      key: "d",
      left: 25,
      top: 25,
      width: 100,
      height: 100,
    });

    expect(refLine.hasMatchedRefLine("vl")).toEqual(true);
    expect(refLine.hasMatchedRefLine("ht")).toEqual(true);

    expect(refLine.getAllRefLines().length).toEqual(0);

    expect(
      refLine.getAdsorbDelta(
        {
          left: 8,
          top: 8,
        },
        10,
        {
          x: "right",
          y: "down",
        }
      )
    ).toEqual({
      left: 0,
      top: 0,
    });

    expect(
      refLine.getAdsorbDelta(
        {
          left: 18,
          top: 18,
        },
        10,
        {
          x: "right",
          y: "down",
        }
      )
    ).toEqual({
      left: 18,
      top: 18,
    });
  });
});
