import { RefLine } from "../src";

describe("test RefLine::prototype", () => {
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
    });

    expect(refLine.vLines.length).toEqual(9);
    expect(refLine.vLineMap.size).toEqual(9);
    expect(refLine.vLineMap.get("0")?.length).toEqual(1);
    expect(refLine.hLines.length).toEqual(9);
    expect(refLine.hLineMap.size).toEqual(9);

    const rect = refLine.addPoint({
      x: 1,
      y: 1,
    });

    refLine.removePoint(rect.key);

    expect(refLine.vLines.length).toEqual(9);
    expect(refLine.vLineMap.size).toEqual(9);
    expect(refLine.vLineMap.get("0")?.length).toEqual(1);
    expect(refLine.hLines.length).toEqual(9);
    expect(refLine.hLineMap.size).toEqual(9);
  });

  test("basic - 2", () => {
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
        left: 50,
        top: 50,
        width: 100,
        height: 100,
      },
      {
        key: "c",
        left: 110,
        top: 200,
        width: 200,
        height: 200,
      },
    ];
    const refLine = new RefLine({
      rects,
    });

    expect(refLine.vLines.length).toEqual(7);
    expect(refLine.vLineMap.size).toEqual(7);
    expect(refLine.hLines.length).toEqual(7);
    expect(refLine.hLineMap.size).toEqual(7);
  });
});

describe("test RefLine::getOffsetRefLineMetaList", () => {
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
        left: 50,
        top: 50,
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
    });

    expect(refLine.getOffsetRefLineMetaList("vertical", 30).length).toEqual(0);
    expect(refLine.getOffsetRefLineMetaList("horizontal", 30).length).toEqual(0);
    expect(refLine.getOffsetRefLineMetaList("vertical", 50).length).toEqual(2);
    expect(refLine.getOffsetRefLineMetaList("horizontal", 50).length).toEqual(2);
  });
});

describe("test RefLine::matchVRefLines", () => {
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
        left: 50,
        top: 50,
        width: 100,
        height: 100,
      },
    ];

    const rect = {
      key: "c",
      left: 50,
      top: 50,
      width: 200,
      height: 200,
    };

    const refLine = new RefLine({
      rects,
      current: rect,
    });

    const vRefLines = refLine.matchVRefLines();
    const hRefLines = refLine.matchHRefLines();

    expect(vRefLines.length).toEqual(2);

    expect(vRefLines[0]).toMatchObject({
      type: "vertical",
      left: 50,
      top: 0,
      size: 250,
    });
    expect(vRefLines[1]).toMatchObject({
      type: "vertical",
      left: 150,
      top: 50,
      size: 200,
    });

    expect(hRefLines.length).toEqual(2);

    expect(hRefLines[0]).toMatchObject({
      type: "horizontal",
      left: 0,
      top: 50,
      size: 250,
    });
    expect(hRefLines[1]).toMatchObject({
      type: "horizontal",
      left: 50,
      top: 150,
      size: 200,
    });
  });

  test("basic - 2", () => {
    const rects = [
      {
        key: "a",
        left: 300,
        top: 0,
        width: 100,
        height: 100,
      },

      {
        key: "b",
        left: 50,
        top: 300,
        width: 100,
        height: 100,
      },
    ];

    const rect = {
      key: "c",
      left: 50,
      top: 50,
      width: 200,
      height: 200,
    };
    const refLine = new RefLine({
      rects,
      current: rect,
    });

    const vRefLines = refLine.matchVRefLines();
    const hRefLines = refLine.matchHRefLines();

    expect(vRefLines.length).toEqual(2);

    expect(vRefLines[0]).toMatchObject({
      type: "vertical",
      left: 50,
      top: 50,
      size: 350,
    });
    expect(vRefLines[1]).toMatchObject({
      type: "vertical",
      left: 150,
      top: 50,
      size: 350,
    });

    expect(hRefLines.length).toEqual(1);

    expect(hRefLines[0]).toMatchObject({
      type: "horizontal",
      left: 50,
      top: 50,
      size: 350,
    });
  });

  test("basic - 3", () => {
    const rects = [
      {
        key: "a",
        left: 100,
        top: 100,
        width: 100,
        height: 100,
      },

      {
        key: "b",
        left: 100,
        top: 150,
        width: 100,
        height: 100,
      },
    ];

    const rect = {
      key: "c",
      left: 50,
      top: 50,
      width: 200,
      height: 200,
    };
    const refLine = new RefLine({
      rects,
      current: rect,
    });

    const vRefLines = refLine.matchVRefLines();
    const hRefLines = refLine.matchHRefLines();

    expect(vRefLines.length).toEqual(1);

    expect(vRefLines[0]).toMatchObject({
      type: "vertical",
      left: 150,
      top: 50,
      size: 200,
    });

    expect(hRefLines.length).toEqual(2);

    expect(hRefLines[0]).toMatchObject({
      type: "horizontal",
      left: 50,
      top: 150,
      size: 200,
    });
    expect(hRefLines[1]).toMatchObject({
      type: "horizontal",
      left: 50,
      top: 250,
      size: 200,
    });
  });

  test("basic - 4", () => {
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
      current: "c",
    });

    const vRefLines = refLine.matchVRefLines();
    const hRefLines = refLine.matchHRefLines();

    expect(vRefLines.length).toEqual(0);
    expect(hRefLines.length).toEqual(0);
  });

  test("basic - 5", () => {
    const rects = [
      {
        key: "a",
        left: 0,
        top: 0,
        width: 101,
        height: 101,
      },
    ];

    const rect = {
      key: "b",
      left: 50.5,
      top: 50.5,
      width: 101,
      height: 101,
    };

    const refLine = new RefLine({
      rects,
      current: rect,
    });

    const vRefLines = refLine.matchVRefLines();
    const hRefLines = refLine.matchHRefLines();

    expect(vRefLines.length).toEqual(2);

    expect(vRefLines[0]).toMatchObject({
      type: "vertical",
      left: 50.5,
      top: 0,
    });
    expect(vRefLines[1]).toMatchObject({
      type: "vertical",
      left: 101,
      top: 0,
    });

    expect(hRefLines.length).toEqual(2);

    expect(hRefLines[0]).toMatchObject({
      type: "horizontal",
      left: 0,
      top: 50.5,
    });
    expect(hRefLines[1]).toMatchObject({
      type: "horizontal",
      left: 0,
      top: 101,
    });
  });

  test("basic - 6", () => {
    const rects = [
      {
        key: "a",
        left: 0,
        top: 0,
        width: 101,
        height: 101,
      },
    ];

    const rect = {
      key: "c",
      left: 50.5,
      top: 50.5,
      width: 101,
      height: 101,
    };

    const refLine = new RefLine({
      rects,
      current: rect,
    });

    const vRefLines = refLine.matchVRefLines();
    const hRefLines = refLine.matchHRefLines();

    expect(vRefLines.length).toEqual(2);
    expect(vRefLines[0]).toMatchObject({
      type: "vertical",
      left: 50.5,
      top: 0,
      size: 151.5,
    });
    expect(vRefLines[1]).toMatchObject({
      type: "vertical",
      left: 101,
      top: 0,
      size: 151.5,
    });

    expect(hRefLines.length).toEqual(2);

    expect(hRefLines[0]).toMatchObject({
      type: "horizontal",
      left: 0,
      top: 50.5,
      size: 151.5,
    });
    expect(hRefLines[1]).toMatchObject({
      type: "horizontal",
      left: 0,
      top: 101,
      size: 151.5,
    });
  });
});

describe("test RefLine::hasMatchedRefLine", () => {
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
      current: "c",
    });

    expect(refLine.hasMatchedRefLine("vl")).toEqual(false);
    expect(refLine.hasMatchedRefLine("vc")).toEqual(false);
    expect(refLine.hasMatchedRefLine("vr")).toEqual(false);
    expect(refLine.hasMatchedRefLine("ht")).toEqual(false);
    expect(refLine.hasMatchedRefLine("hc")).toEqual(false);
    expect(refLine.hasMatchedRefLine("hb")).toEqual(false);
  });

  test("basic - 2", () => {
    const rects = [
      {
        key: "a",
        left: 300,
        top: 0,
        width: 100,
        height: 100,
      },

      {
        key: "b",
        left: 50,
        top: 300,
        width: 100,
        height: 100,
      },
    ];

    const rect = {
      key: "c",
      left: 50,
      top: 50,
      width: 200,
      height: 200,
    };
    const refLine = new RefLine({
      rects,
      current: rect,
    });

    const vRefLines = refLine.matchVRefLines();
    const hRefLines = refLine.matchHRefLines();

    expect(refLine.hasMatchedRefLine("vl")).toEqual(true);
    expect(refLine.hasMatchedRefLine("vc")).toEqual(true);
    expect(refLine.hasMatchedRefLine("vr")).toEqual(false);
    expect(refLine.hasMatchedRefLine("ht")).toEqual(true);
    expect(refLine.hasMatchedRefLine("hc")).toEqual(false);
    expect(refLine.hasMatchedRefLine("hb")).toEqual(false);
  });
});

describe("test RefLine::getNearestOffsetFromOffset", () => {
  test("basic - 1", () => {
    const rects = [
      {
        key: "a",
        left: 0,
        top: 0,
        width: 101,
        height: 101,
      },
    ];
    const refLine = new RefLine({
      rects,
    });

    expect(refLine.getNearestOffsetFromOffset("vertical", 0)).toEqual([null, [50.5, 50.5]]);
    expect(refLine.getNearestOffsetFromOffset("horizontal", 0)).toEqual([null, [50.5, 50.5]]);

    expect(refLine.getNearestOffsetFromOffset("vertical", 51)).toEqual([
      [50.5, 0.5],
      [101, 50],
    ]);
    expect(refLine.getNearestOffsetFromOffset("horizontal", 51)).toEqual([
      [50.5, 0.5],
      [101, 50],
    ]);

    expect(refLine.getNearestOffsetFromOffset("vertical", 101)).toEqual([[50.5, 50.5], null]);
    expect(refLine.getNearestOffsetFromOffset("horizontal", 101)).toEqual([[50.5, 50.5], null]);
  });
  test("basic - 2", () => {
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
    });

    expect(refLine.getNearestOffsetFromOffset("vertical", 100)).toEqual([
      [50, 50],
      [200, 100],
    ]);
    expect(refLine.getNearestOffsetFromOffset("horizontal", 100)).toEqual([
      [50, 50],
      [200, 100],
    ]);

    expect(refLine.getNearestOffsetFromOffset("vertical", 120)).toEqual([
      [100, 20],
      [200, 80],
    ]);
    expect(refLine.getNearestOffsetFromOffset("horizontal", 120)).toEqual([
      [100, 20],
      [200, 80],
    ]);

    expect(refLine.getNearestOffsetFromOffset("vertical", -100)).toEqual([null, [0, 100]]);
    expect(refLine.getNearestOffsetFromOffset("horizontal", -100)).toEqual([null, [0, 100]]);

    expect(refLine.getNearestOffsetFromOffset("vertical", 900)).toEqual([[700, 200], null]);
    expect(refLine.getNearestOffsetFromOffset("horizontal", 900)).toEqual([[700, 200], null]);
  });
});

describe("test RefLine::getAdsorbDelta  -1", () => {
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
      left: 150,
      top: 150,
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

  test("basic - 1", () => {
    const rect = {
      key: "d",
      left: 80,
      top: 80,
      width: 100,
      height: 100,
    };
    const refLine = new RefLine({
      rects,
      current: rect,
    });

    expect(
      refLine.getAdsorbDelta(
        {
          left: 0,
          top: 0,
        },
        5,
        {
          x: "right",
          y: "down",
        }
      )
    ).toEqual({
      left: 0,
      top: 0,
    });
  });

  test("basic - 2", () => {
    const rect = {
      key: "d",
      left: 46,
      top: 80,
      width: 100,
      height: 100,
    };
    const refLine = new RefLine({
      rects,
      current: rect,
    });

    expect(
      refLine.getAdsorbDelta(
        {
          left: 1,
          top: 0,
        },
        5,
        {
          x: "right",
          y: "down",
        }
      )
    ).toEqual({
      left: 4,
      top: 0,
    });
  });

  test("basic - 4", () => {
    const rect = {
      key: "d",
      left: 46,
      top: 46,
      width: 100,
      height: 100,
    };
    const refLine = new RefLine({
      rects,
      current: rect,
    });

    expect(
      refLine.getAdsorbDelta(
        {
          left: 1,
          top: 1,
        },
        5,
        {
          x: "right",
          y: "down",
        }
      )
    ).toEqual({
      left: 4,
      top: 4,
    });
  });

  test("basic - 5", () => {
    const rect = {
      key: "d",
      left: 46,
      top: 46,
      width: 100,
      height: 100,
    };
    const refLine = new RefLine({
      rects,
      current: rect,
    });

    expect(
      refLine.getAdsorbDelta(
        {
          left: -1,
          top: -1,
        },
        5,
        {
          x: "left",
          y: "up",
        }
      )
    ).toEqual({
      left: -1,
      top: -1,
    });
  });

  test("basic - 6", () => {
    const rect = {
      key: "d",
      left: 46,
      top: 46,
      width: 100,
      height: 100,
    };
    const refLine = new RefLine({
      rects,
      current: rect,
    });

    expect(
      refLine.getAdsorbDelta(
        {
          left: -13,
          top: -13,
        },
        5,
        {
          x: "left",
          y: "up",
        }
      )
    ).toEqual({
      left: -13,
      top: -13,
    });
  });

  test("basic - 7", () => {
    const rect = {
      key: "d",
      left: 46,
      top: 46,
      width: 100,
      height: 100,
    };
    const refLine = new RefLine({
      rects,
      current: rect,
    });

    expect(
      refLine.getAdsorbDelta(
        {
          left: -43,
          top: -43,
        },
        5,
        {
          x: "left",
          y: "up",
        }
      )
    ).toEqual({
      left: -46,
      top: -46,
    });
  });

  test("basic - 8", () => {
    const refLine = new RefLine({
      rects,
    });

    const rect = {
      key: "d",
      left: 46,
      top: 46,
      width: 100,
      height: 100,
    };

    refLine.setCurrent(rect);

    expect(
      refLine.getAdsorbDelta(
        {
          left: 4,
          top: 4,
        },
        5,
        {
          x: "right",
          y: "down",
        }
      )
    ).toEqual({
      left: 4,
      top: 4,
    });
  });

  test("basic - 8", () => {
    const refLine = new RefLine({
      rects,
    });

    const rect = {
      key: "d",
      left: 46,
      top: 46,
      width: 100,
      height: 100,
    };

    refLine.setCurrent(rect);

    expect(
      refLine.getAdsorbDelta(
        {
          left: 8,
          top: 8,
        },
        5,
        {
          x: "right",
          y: "down",
        }
      )
    ).toEqual({
      left: 8,
      top: 8,
    });
  });

  test("basic - 9", () => {
    const refLine = new RefLine({
      rects,
    });

    const rect = {
      key: "d",
      left: 50,
      top: 50,
      width: 100,
      height: 100,
    };

    refLine.setCurrent(rect);

    expect(
      refLine.getAdsorbDelta(
        {
          left: 4,
          top: 4,
        },
        5,
        {
          x: "right",
          y: "down",
        }
      )
    ).toEqual({
      left: 0,
      top: 0,
    });
  });

  test("basic - 10", () => {
    const refLine = new RefLine({
      rects: [
        ...rects,
        {
          key: "e",
          left: 53,
          top: 53,
          width: 100,
          height: 100,
        },
        {
          key: "f",
          left: 56,
          top: 56,
          width: 100,
          height: 100,
        },
      ],
    });

    const rect = {
      key: "x",
      left: 51,
      top: 51,
      width: 100,
      height: 100,
    };

    refLine.setCurrent(rect);

    expect(
      refLine.getAdsorbDelta(
        {
          left: 3,
          top: 3,
        },
        5,
        {
          x: "right",
          y: "down",
        }
      )
    ).toEqual({
      left: 3,
      top: 3,
    });

    expect(
      refLine.getAdsorbDelta(
        {
          left: 1,
          top: 1,
        },
        5,
        {
          x: "right",
          y: "down",
        }
      )
    ).toEqual({
      left: 2,
      top: 2,
    });
  });

  test("basic - 11", () => {
    const refLine = new RefLine({
      rects: [
        ...rects,
        {
          key: "e",
          left: 53,
          top: 53,
          width: 100,
          height: 100,
        },
        {
          key: "f",
          left: 56,
          top: 56,
          width: 100,
          height: 100,
        },
      ],
    });

    const rect = {
      key: "y",
      left: 50,
      top: 50,
      width: 100,
      height: 100,
    };

    refLine.setCurrent(rect);

    expect(
      refLine.getAdsorbDelta(
        {
          left: 3,
          top: 3,
        },
        5,
        {
          x: "right",
          y: "down",
        }
      )
    ).toEqual({
      left: 3,
      top: 3,
    });
  });
});

describe("test RefLine::getAdsorbDelta  -2", () => {
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
      left: -150,
      top: -150,
      width: 100,
      height: 100,
    },
    {
      key: "c",
      left: -200,
      top: -200,
      width: 200,
      height: 200,
    },
  ];

  test("basic - 1", () => {
    const refLine = new RefLine({
      rects,
    });

    const rect = {
      key: "d",
      left: 80,
      top: 80,
      width: 100,
      height: 100,
    };

    refLine.setCurrent(rect);

    expect(
      refLine.getAdsorbDelta(
        {
          left: 0,
          top: 0,
        },
        5,
        {
          x: "right",
          y: "down",
        }
      )
    ).toEqual({
      left: 0,
      top: 0,
    });
  });

  test("basic - 2", () => {
    const refLine = new RefLine({
      rects,
    });

    const rect = {
      key: "d",
      left: 46,
      top: 80,
      width: 100,
      height: 100,
    };

    refLine.setCurrent(rect);

    expect(
      refLine.getAdsorbDelta(
        {
          left: 1,
          top: 0,
        },
        5,
        {
          x: "right",
          y: "down",
        }
      )
    ).toEqual({
      left: 4,
      top: 0,
    });
  });

  test("basic - 4", () => {
    const refLine = new RefLine({
      rects,
    });

    const rect = {
      key: "d",
      left: 46,
      top: 46,
      width: 100,
      height: 100,
    };
    refLine.setCurrent(rect);

    expect(
      refLine.getAdsorbDelta(
        {
          left: 1,
          top: 1,
        },
        5,
        {
          x: "right",
          y: "down",
        }
      )
    ).toEqual({
      left: 4,
      top: 4,
    });
  });

  test("basic - 5", () => {
    const refLine = new RefLine({
      rects,
    });

    const rect = {
      key: "d",
      left: 46,
      top: 46,
      width: 100,
      height: 100,
    };

    refLine.setCurrent(rect);

    expect(
      refLine.getAdsorbDelta(
        {
          left: -1,
          top: -1,
        },
        5,
        {
          x: "left",
          y: "up",
        }
      )
    ).toEqual({
      left: -1,
      top: -1,
    });
  });

  test("basic - 6", () => {
    const refLine = new RefLine({
      rects,
    });

    const rect = {
      key: "d",
      left: 46,
      top: 46,
      width: 100,
      height: 100,
    };

    refLine.setCurrent(rect);

    expect(
      refLine.getAdsorbDelta(
        {
          left: -13,
          top: -13,
        },
        5,
        {
          x: "left",
          y: "up",
        }
      )
    ).toEqual({
      left: -13,
      top: -13,
    });
  });

  test("basic - 7", () => {
    const refLine = new RefLine({
      rects,
    });

    const rect = {
      key: "d",
      left: 46,
      top: 46,
      width: 100,
      height: 100,
    };

    refLine.setCurrent(rect);

    expect(
      refLine.getAdsorbDelta(
        {
          left: -43,
          top: -43,
        },
        5,
        {
          x: "left",
          y: "up",
        }
      )
    ).toEqual({
      left: -46,
      top: -46,
    });
  });

  test("basic - 8", () => {
    const refLine = new RefLine({
      rects,
    });

    const rect = {
      key: "d",
      left: 46,
      top: 46,
      width: 100,
      height: 100,
    };

    refLine.setCurrent(rect);

    expect(
      refLine.getAdsorbDelta(
        {
          left: 4,
          top: 4,
        },
        5,
        {
          x: "right",
          y: "down",
        }
      )
    ).toEqual({
      left: 4,
      top: 4,
    });
  });

  test("basic - 9", () => {
    const refLine = new RefLine({
      rects,
    });

    const rect = {
      key: "d",
      left: 46,
      top: 46,
      width: 100,
      height: 100,
    };
    refLine.setCurrent(rect);

    expect(
      refLine.getAdsorbDelta(
        {
          left: 8,
          top: 8,
        },
        5,
        {
          x: "right",
          y: "down",
        }
      )
    ).toEqual({
      left: 8,
      top: 8,
    });
  });
});

describe("test RefLine::getAdsorbDelta  -3", () => {
  const rects = [
    {
      key: "node1",
      left: 50,
      top: 160,
      width: 150,
      height: 50,
    },
  ];

  test("basic - 1", () => {
    const refLine = new RefLine({
      rects,
    });

    const rect = {
      key: "node2",
      left: 50,
      top: 80,
      width: 150,
      height: 50,
    };

    refLine.setCurrent(rect);

    expect(
      refLine.getAdsorbDelta(
        {
          left: 0,
          top: 20,
        },
        16,
        {
          x: "right",
          y: "down",
        }
      )
    ).toEqual({
      left: 0,
      top: 30,
    });
  });

  test("basic - 2", () => {
    const refLine = new RefLine({
      rects,
    });

    const rect = {
      key: "node2",
      left: -150,
      top: 0,
      width: 150,
      height: 50,
    };
    refLine.setCurrent(rect);

    expect(
      refLine.getAdsorbDelta(
        {
          left: 40,
          top: 0,
        },
        16,
        {
          x: "right",
          y: "down",
        }
      )
    ).toEqual({
      left: 50,
      top: 0,
    });
  });

  test("basic - 3", () => {
    const refLine = new RefLine({
      rects: [
        {
          key: "node3",
          left: 360,
          top: 143,
          width: 150,
          height: 65,
        },
        {
          key: "node1",
          left: 100,
          top: 160,
          width: 150,
          height: 65,
        },
      ],
    });

    const rect = {
      key: "node2",
      left: 230,
      top: 348,
      width: 150,
      height: 65,
    };
    refLine.setCurrent(rect);

    expect(
      refLine.getAdsorbDelta(
        {
          left: -12,
          top: 0,
        },
        10,
        {
          x: "left",
          y: "down",
        }
      )
    ).toEqual({
      left: -20,
      top: 0,
    });
  });

  test("basic - 5", () => {
    const refLine = new RefLine({
      rects: [
        {
          key: "node1",
          left: 294,
          top: 177,
          width: 150,
          height: 65,
        },
        {
          key: "node4",
          left: 458,
          top: 295,
          width: 150,
          height: 65,
        },
      ],
    });

    const rect = {
      key: "node2",
      left: 347,
      top: 222,
      width: 150,
      height: 65,
    };
    refLine.setCurrent(rect);

    expect(
      refLine.getAdsorbDelta(
        {
          left: 0,
          top: 1,
        },
        10,
        {
          x: "left",
          y: "down",
        }
      )
    ).toEqual({
      left: 0,
      top: 8,
    });
  });

  test("basic - 6", () => {
    const refLine = new RefLine({
      rects: [
        {
          key: "node1",
          left: 294,
          top: 177,
          width: 150,
          height: 65,
        },
        {
          key: "node4",
          left: 458,
          top: 295,
          width: 150,
          height: 65,
        },
      ],
    });

    const rect = {
      key: "node2",
      left: 347,
      top: 212,
      width: 150,
      height: 65,
    };
    refLine.setCurrent(rect);

    expect(
      refLine.getAdsorbDelta(
        {
          left: 0,
          top: 12,
        },
        11,
        {
          x: "left",
          y: "down",
        }
      )
    ).toEqual({
      left: 0,
      top: 18,
    });
  });

  test("basic - 7", () => {
    const refLine = new RefLine({
      rects: [
        {
          key: "node1",
          left: 32,
          top: 244,
          width: 150,
          height: 65,
        },
      ],
    });

    const rect = {
      key: "node2",
      left: 227,
      top: 276.5,
      width: 150,
      height: 65,
    };
    refLine.setCurrent(rect);

    expect(
      refLine.getAdsorbDelta(
        {
          left: 0,
          top: -5,
        },
        21,
        {
          x: "left",
          y: "up",
        }
      )
    ).toEqual({
      left: 0,
      top: 0,
    });
  });

  test("basic - 8", () => {
    const refLine = new RefLine({
      rects: [
        {
          key: "node1",
          left: 248,
          top: 456.5,
          width: 151,
          height: 65,
        },
      ],
    });

    // const rect = {
    //   key: "node2",
    //   left: 324,
    //   top: 521.5,
    //   width: 150,
    //   height: 65,
    // };
    // refLine.setCurrent(rect);

    // expect(
    //   refLine.getAdsorbDelta(
    //     {
    //       left: -1,
    //       top: 0,
    //     },
    //     14
    //   )
    // ).toEqual({
    //   left: 0.5,
    //   top: 0,
    // });
  });
});

describe("test RefLine::getAdsorbDelta  -4", () => {
  const rects: any = [];

  test("basic - 1", () => {
    const refLine = new RefLine({
      rects,
    });

    const rect = {
      key: "node2",
      left: 50,
      top: 80,
      width: 150,
      height: 50,
    };
    refLine.setCurrent(rect);

    expect(
      refLine.getAdsorbDelta(
        {
          left: 20,
          top: 20,
        },
        16,
        {
          x: "right",
          y: "down",
        }
      )
    ).toEqual({
      left: 20,
      top: 20,
    });

    expect(
      refLine.getAdsorbDelta(
        {
          left: -20,
          top: -20,
        },
        16,
        {
          x: "left",
          y: "up",
        }
      )
    ).toEqual({
      left: -20,
      top: -20,
    });
  });
});

describe("test RefLine::getOffsetAdsorbDelta  -1", () => {
  const rects = [
    {
      key: "a",
      left: 100,
      top: 100,
      width: 100,
      height: 100,
    },
  ];

  test("basic - 1", () => {
    const refLine = new RefLine({
      rects,
    });

    expect(refLine.getOffsetAdsorbDelta("vertical", 100, 2, 5)).toEqual(0);
    expect(refLine.getOffsetAdsorbDelta("horizontal", 100, 2, 5)).toEqual(0);
    expect(refLine.getOffsetAdsorbDelta("vertical", 100, -2, 5)).toEqual(0);
    expect(refLine.getOffsetAdsorbDelta("horizontal", 100, -2, 5)).toEqual(0);
  });

  test("basic - 2", () => {
    const refLine = new RefLine({
      rects,
    });

    expect(refLine.getOffsetAdsorbDelta("vertical", 100, 5, 5)).toEqual(0);
    expect(refLine.getOffsetAdsorbDelta("horizontal", 100, 5, 5)).toEqual(0);
    expect(refLine.getOffsetAdsorbDelta("vertical", 100, -5, 5)).toEqual(0);
    expect(refLine.getOffsetAdsorbDelta("horizontal", 100, -5, 5)).toEqual(0);

    expect(refLine.getOffsetAdsorbDelta("vertical", 100, 8, 5)).toEqual(8);
    expect(refLine.getOffsetAdsorbDelta("horizontal", 100, 8, 5)).toEqual(8);
    expect(refLine.getOffsetAdsorbDelta("vertical", 100, -8, 5)).toEqual(-8);
    expect(refLine.getOffsetAdsorbDelta("horizontal", 100, -8, 5)).toEqual(-8);
  });

  test("basic - 3", () => {
    const refLine = new RefLine({
      rects,
    });

    expect(refLine.getOffsetAdsorbDelta("vertical", 150, 52, 5)).toEqual(52);
    expect(refLine.getOffsetAdsorbDelta("horizontal", 150, 52, 5)).toEqual(52);
    expect(refLine.getOffsetAdsorbDelta("vertical", 150, -52, 5)).toEqual(-52);
    expect(refLine.getOffsetAdsorbDelta("horizontal", 150, -52, 5)).toEqual(-52);
  });
});

describe("test RefLine::getOffsetAdsorbDelta  -2", () => {
  const rects = [
    {
      key: "a",
      left: 100,
      top: 100,
      width: 100,
      height: 100,
    },
  ];

  test("basic - 1", () => {
    const refLine = new RefLine({
      rects,
    });

    expect(refLine.getOffsetAdsorbDelta("vertical", 140, 2, 5)).toEqual(2);
    expect(refLine.getOffsetAdsorbDelta("horizontal", 140, 2, 5)).toEqual(2);
    expect(refLine.getOffsetAdsorbDelta("vertical", 140, -2, 5)).toEqual(-2);
    expect(refLine.getOffsetAdsorbDelta("horizontal", 140, -2, 5)).toEqual(-2);

    expect(refLine.getOffsetAdsorbDelta("vertical", 140, 5, 5)).toEqual(10);
    expect(refLine.getOffsetAdsorbDelta("horizontal", 140, 5, 5)).toEqual(10);
    expect(refLine.getOffsetAdsorbDelta("vertical", 140, -5, 5)).toEqual(-5);
    expect(refLine.getOffsetAdsorbDelta("horizontal", 140, -5, 5)).toEqual(-5);

    expect(refLine.getOffsetAdsorbDelta("vertical", 140, 6, 5)).toEqual(10);
    expect(refLine.getOffsetAdsorbDelta("horizontal", 140, 6, 5)).toEqual(10);
    expect(refLine.getOffsetAdsorbDelta("vertical", 140, -36, 5)).toEqual(-40);
    expect(refLine.getOffsetAdsorbDelta("horizontal", 140, -36, 5)).toEqual(-40);

    expect(refLine.getOffsetAdsorbDelta("vertical", 140, 13, 5)).toEqual(13);
    expect(refLine.getOffsetAdsorbDelta("horizontal", 140, 13, 5)).toEqual(13);
    expect(refLine.getOffsetAdsorbDelta("vertical", 140, -43, 5)).toEqual(-43);
    expect(refLine.getOffsetAdsorbDelta("horizontal", 140, -43, 5)).toEqual(-43);
  });
});

describe("test RefLine::opts  - filterLine", () => {
  const rects = [
    {
      key: "a",
      left: 100,
      top: 100,
      width: 100,
      height: 100,
    },
  ];

  const current = {
    key: "b",
    left: 100,
    top: 100,
    width: 100,
    height: 100,
  };

  test("basic - 1", () => {
    const refLine = new RefLine({
      rects,
      current,
      lineFilter(line) {
        if (line.position === "vc") return false;
        return true;
      },
    });

    expect(refLine.getAllRefLines().length).toEqual(5);
  });

  test("basic - 2", () => {
    const refLine = new RefLine({
      rects,
      current,
    });

    refLine.setLineFilter((line) => {
      if (line.position === "vc" || line.position === "hb") return false;
      return true;
    });

    expect(refLine.getAllRefLines().length).toEqual(4);
  });

  test("basic - 3", () => {
    const refLine = new RefLine({
      rects,
      current,
      lineFilter(line) {
        if (line.position === "vc") return false;
        return true;
      },
    });

    expect(refLine.getAllRefLines().length).toEqual(5);

    refLine.setLineFilter(null);

    expect(refLine.getAllRefLines().length).toEqual(6);
  });

  test("lineFilter - getNearestOffsetFromOffset", () => {
    const refLine = new RefLine({
      rects,
      current,
      lineFilter(line) {
        if (line.position === "vc" || line.position === "hc") return false;
        return true;
      },
    });

    expect(refLine.getNearestOffsetFromOffset("vertical", 120)).toEqual([
      [100, 20],
      [200, 80],
    ]);

    expect(refLine.getNearestOffsetFromOffset("vertical", 170)).toEqual([
      [100, 70],
      [200, 30],
    ]);

    expect(refLine.getNearestOffsetFromOffset("horizontal", 120)).toEqual([
      [100, 20],
      [200, 80],
    ]);

    expect(refLine.getNearestOffsetFromOffset("horizontal", 170)).toEqual([
      [100, 70],
      [200, 30],
    ]);

    refLine.setLineFilter(null);

    expect(refLine.getNearestOffsetFromOffset("vertical", 120)).toEqual([
      [100, 20],
      [150, 30],
    ]);

    expect(refLine.getNearestOffsetFromOffset("vertical", 170)).toEqual([
      [150, 20],
      [200, 30],
    ]);

    expect(refLine.getNearestOffsetFromOffset("horizontal", 120)).toEqual([
      [100, 20],
      [150, 30],
    ]);

    expect(refLine.getNearestOffsetFromOffset("horizontal", 170)).toEqual([
      [150, 20],
      [200, 30],
    ]);
  });
});

describe("test RefLine::opts  - adsorbLineFilter", () => {
  const rects = [
    {
      key: "a",
      left: 100,
      top: 100,
      width: 100,
      height: 100,
    },
  ];

  const current = {
    key: "b",
    left: 100,
    top: 100,
    width: 100,
    height: 100,
  };

  test("adsorbLineFilter - getNearestOffsetFromOffset1", () => {
    const refLine = new RefLine({
      rects,
      current,
      adsorbLineFilter(line) {
        return false;
      },
    });

    expect(refLine.getNearestOffsetFromOffset("vertical", 120)).toEqual([null, null]);

    expect(refLine.getNearestOffsetFromOffset("vertical", 170)).toEqual([null, null]);

    expect(refLine.getNearestOffsetFromOffset("horizontal", 120)).toEqual([null, null]);

    expect(refLine.getNearestOffsetFromOffset("horizontal", 170)).toEqual([null, null]);
  });

  test("adsorbLineFilter - getNearestOffsetFromOffset2", () => {
    const refLine = new RefLine({
      rects,
      current,
      adsorbHLines: [
        {
          key: "h1",
          offset: 500,
        },
        {
          key: "h2",
          offset: 400,
        },
      ],
      adsorbVLines: [
        {
          key: "v1",
          offset: 500,
        },
        {
          key: "v2",
          offset: 400,
        },
      ],
    });

    expect(refLine.getNearestOffsetFromOffset("vertical", 450)).toEqual([
      [400, 50],
      [500, 50],
    ]);

    expect(refLine.getNearestOffsetFromOffset("horizontal", 450)).toEqual([
      [400, 50],
      [500, 50],
    ]);
  });

  test("adsorbLineFilter - getNearestOffsetFromOffset3", () => {
    const refLine = new RefLine({
      rects,
      current,
      adsorbHLines: [
        {
          key: "h1",
          offset: 500,
        },
        {
          key: "h2",
          offset: 400,
        },
      ],
      adsorbVLines: [
        {
          key: "v1",
          offset: 500,
        },
        {
          key: "v2",
          offset: 400,
        },
      ],
      adsorbLineFilter(line) {
        return !line.refLineMetaList.every((line) => line.adsorbOnly);
      },
    });

    expect(refLine.getNearestOffsetFromOffset("vertical", 450)).toEqual([[200, 250], null]);

    expect(refLine.getNearestOffsetFromOffset("horizontal", 450)).toEqual([[200, 250], null]);
  });
});
