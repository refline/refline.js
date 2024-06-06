import { createRefLine } from "../src";

describe("test adsorbCreator", () => {
  test("basic 01", () => {
    const rect1 = {
      key: "a",
      left: 0,
      top: 0,
      width: 100,
      height: 100,
    };

    const rect2 = {
      key: "b",
      left: 0,
      top: 0,
      width: 100,
      height: 100,
    };

    const refLine = createRefLine({
      rects: [rect1],
    });

    const updater = refLine.adsorbCreator({
      current: rect2,
      pageX: 0,
      pageY: 0,
      distance: 5,
    });

    expect(
      updater({
        pageX: 3,
        pageY: 3,
      })
    ).toMatchObject({
      raw: {
        left: 3,
        top: 3,
      },
      delta: {
        left: 0,
        top: 0,
      },
      offset: {
        left: 0,
        top: 0,
      },
      rect: {
        left: 0,
        top: 0,
      },
    });

    expect(
      updater({
        pageX: 5,
        pageY: 5,
      })
    ).toMatchObject({
      raw: {
        left: 5,
        top: 5,
      },
      delta: {
        left: 0,
        top: 0,
      },
      offset: {
        left: 0,
        top: 0,
      },
      rect: {
        left: 0,
        top: 0,
      },
    });

    expect(
      updater({
        pageX: 6,
        pageY: 6,
      })
    ).toMatchObject({
      raw: {
        left: 6,
        top: 6,
      },
      delta: {
        left: 6,
        top: 6,
      },
      offset: {
        left: 6,
        top: 6,
      },
      rect: {
        left: 6,
        top: 6,
      },
    });

    expect(
      updater({
        pageX: 5,
        pageY: 5,
      })
    ).toMatchObject({
      delta: {
        left: -6,
        top: -6,
      },
      rect: {
        left: 0,
        top: 0,
      },
    });

    expect(
      updater({
        pageX: 1,
        pageY: 1,
      })
    ).toMatchObject({
      delta: {
        left: 0,
        top: 0,
      },
      rect: {
        left: 0,
        top: 0,
      },
    });

    expect(
      updater({
        pageX: -1,
        pageY: -1,
      })
    ).toMatchObject({
      delta: {
        left: 0,
        top: 0,
      },
      rect: {
        left: 0,
        top: 0,
      },
    });

    expect(
      updater({
        pageX: -5,
        pageY: -5,
      })
    ).toMatchObject({
      delta: {
        left: 0,
        top: 0,
      },
      rect: {
        left: 0,
        top: 0,
      },
    });

    expect(
      updater({
        pageX: -6,
        pageY: -6,
      })
    ).toMatchObject({
      delta: {
        left: -6,
        top: -6,
      },
      rect: {
        left: -6,
        top: -6,
      },
    });

    expect(
      updater({
        pageX: -8,
        pageY: -8,
      })
    ).toMatchObject({
      delta: {
        left: -2,
        top: -2,
      },
      rect: {
        left: -8,
        top: -8,
      },
    });

    expect(
      updater({
        pageX: 8,
        pageY: 8,
      })
    ).toMatchObject({
      delta: {
        left: 16,
        top: 16,
      },
      rect: {
        left: 8,
        top: 8,
      },
    });
  });

  test("basic 02", () => {
    const rect1 = {
      key: "a",
      left: 0,
      top: 0,
      width: 100,
      height: 100,
    };

    const rect2 = {
      key: "b",
      left: 0,
      top: 0,
      width: 100,
      height: 100,
    };

    const refLine = createRefLine({
      rects: [rect1],
    });

    const updater = refLine.adsorbCreator({
      current: rect2,
      pageX: 0,
      pageY: 0,
      distance: 5,
    });

    let ret;

    expect(
      (ret = updater({
        pageX: 3,
        pageY: 3,
      }))
    ).toMatchObject({
      raw: {
        left: 3,
        top: 3,
      },
      delta: {
        left: 0,
        top: 0,
      },
      offset: {
        left: 0,
        top: 0,
      },
      rect: {
        left: 0,
        top: 0,
      },
    });

    rect2.left += ret.delta.left;
    rect2.top += ret.delta.top;

    expect(
      (ret = updater({
        pageX: 5,
        pageY: 5,
      }))
    ).toMatchObject({
      raw: {
        left: 5,
        top: 5,
      },
      delta: {
        left: 0,
        top: 0,
      },
      offset: {
        left: 0,
        top: 0,
      },
      rect: {
        left: 0,
        top: 0,
      },
    });

    rect2.left += ret.delta.left;
    rect2.top += ret.delta.top;

    expect(
      (ret = updater({
        pageX: 6,
        pageY: 6,
      }))
    ).toMatchObject({
      raw: {
        left: 6,
        top: 6,
      },
      delta: {
        left: 6,
        top: 6,
      },
      offset: {
        left: 6,
        top: 6,
      },
      rect: {
        left: 6,
        top: 6,
      },
    });

    rect2.left += ret.delta.left;
    rect2.top += ret.delta.top;

    expect(
      (ret = updater({
        pageX: 8,
        pageY: 8,
      }))
    ).toMatchObject({
      raw: {
        left: 2,
        top: 2,
      },
      delta: {
        left: 2,
        top: 2,
      },
      offset: {
        left: 8,
        top: 8,
      },
      rect: {
        left: 8,
        top: 8,
      },
    });

    rect2.left += ret.delta.left;
    rect2.top += ret.delta.top;

    expect(
      (ret = updater({
        pageX: 5,
        pageY: 5,
      }))
    ).toMatchObject({
      raw: {
        left: -3,
        top: -3,
      },
      delta: {
        left: -8,
        top: -8,
      },
      offset: {
        left: 0,
        top: 0,
      },
      rect: {
        left: 0,
        top: 0,
      },
    });

    rect2.left += ret.delta.left;
    rect2.top += ret.delta.top;

    expect(
      (ret = updater({
        pageX: 1,
        pageY: 1,
      }))
    ).toMatchObject({
      raw: {
        left: 1,
        top: 1,
      },
      delta: {
        left: 0,
        top: 0,
      },
      offset: {
        left: 0,
        top: 0,
      },
      rect: {
        left: 0,
        top: 0,
      },
    });

    rect2.left += ret.delta.left;
    rect2.top += ret.delta.top;

    expect(
      (ret = updater({
        pageX: -1,
        pageY: -1,
      }))
    ).toMatchObject({
      raw: {
        left: -1,
        top: -1,
      },
      delta: {
        left: 0,
        top: 0,
      },
      offset: {
        left: 0,
        top: 0,
      },
      rect: {
        left: 0,
        top: 0,
      },
    });

    rect2.left += ret.delta.left;
    rect2.top += ret.delta.top;

    expect(
      (ret = updater({
        pageX: -5,
        pageY: -5,
      }))
    ).toMatchObject({
      raw: {
        left: -5,
        top: -5,
      },
      delta: {
        left: 0,
        top: 0,
      },
      offset: {
        left: 0,
        top: 0,
      },
      rect: {
        left: 0,
        top: 0,
      },
    });

    rect2.left += ret.delta.left;
    rect2.top += ret.delta.top;

    expect(
      (ret = updater({
        pageX: -6,
        pageY: -6,
      }))
    ).toMatchObject({
      raw: {
        left: -6,
        top: -6,
      },
      delta: {
        left: -6,
        top: -6,
      },
      offset: {
        left: -6,
        top: -6,
      },
      rect: {
        left: -6,
        top: -6,
      },
    });

    rect2.left += ret.delta.left;
    rect2.top += ret.delta.top;

    expect(
      (ret = updater({
        pageX: -8,
        pageY: -8,
      }))
    ).toMatchObject({
      raw: {
        left: -2,
        top: -2,
      },
      delta: {
        left: -2,
        top: -2,
      },
      offset: {
        left: -8,
        top: -8,
      },
      rect: {
        left: -8,
        top: -8,
      },
    });

    rect2.left += ret.delta.left;
    rect2.top += ret.delta.top;

    expect(
      (ret = updater({
        pageX: 8,
        pageY: 8,
      }))
    ).toMatchObject({
      raw: {
        left: 16,
        top: 16,
      },
      delta: {
        left: 16,
        top: 16,
      },
      offset: {
        left: 8,
        top: 8,
      },
      rect: {
        left: 8,
        top: 8,
      },
    });

    rect2.left += ret.delta.left;
    rect2.top += ret.delta.top;
  });

  test("basic 03 lineProcess", () => {
    const rect1 = {
      key: "a",
      left: 126,
      top: 25,
      width: 101,
      height: 101,
    };

    const rect2 = {
      key: "b",
      left: 75,
      top: 147,
      width: 203,
      height: 203,
    };

    const refLine = createRefLine({
      rects: [rect1],
      lineProcess(line) {
        line.offset = ~~line.offset
      }
    });

    const updater = refLine.adsorbCreator({
      current: rect2,
      pageX: 0,
      pageY: 0,
      distance: 5,
    });

    expect(
      updater({
        pageX: -1,
        pageY: 0,
      }).rect
    ).toMatchObject({
      key: "b",
      left: 75,
      top: 147,
      width: 203,
      height: 203,
    });

  });

  test("basic points 01", () => {
    const rect1 = {
      key: "a",
      left: 0,
      top: 0,
      width: 100,
      height: 100,
    };

    const rect2 = {
      key: "b",
      left: 0,
      top: 0,
      width: 100,
      height: 100,
    };

    const refLine = createRefLine({
      rects: [rect1],
      points: [
        {
          x: 150,
          y: 150,
        },
        {
          x: 150,
          y: 350,
        },
        {
          x: 500,
          y: 500,
        },
      ],
    });

    const updater = refLine.adsorbCreator({
      current: rect2,
      pageX: 0,
      pageY: 0,
      distance: 5,
    });

    expect(
      updater({
        pageX: 160,
        pageY: 160,
      })
    ).toMatchObject({
      raw: {
        left: 160,
        top: 160,
      },
      delta: {
        left: 160,
        top: 160,
      },
      offset: {
        left: 160,
        top: 160,
      },
      rect: {
        left: 160,
        top: 160,
      },
    });

    expect(
      updater({
        pageX: 154,
        pageY: 154,
      })
    ).toMatchObject({
      raw: {
        left: -6,
        top: -6,
      },
      delta: {
        left: -10,
        top: -10,
      },
      offset: {
        left: 150,
        top: 150,
      },
      rect: {
        left: 150,
        top: 150,
      },
    });

    expect(refLine.getAllRefLines().length).toEqual(2);

    ////////reset/////////
    updater({
      pageX: 0,
      pageY: 0,
    });

    expect(
      updater({
        pageX: 3,
        pageY: 3,
      })
    ).toMatchObject({
      raw: {
        left: 3,
        top: 3,
      },
      delta: {
        left: 0,
        top: 0,
      },
      offset: {
        left: 0,
        top: 0,
      },
      rect: {
        left: 0,
        top: 0,
      },
    });

    expect(
      updater({
        pageX: 5,
        pageY: 5,
      })
    ).toMatchObject({
      raw: {
        left: 5,
        top: 5,
      },
      delta: {
        left: 0,
        top: 0,
      },
      offset: {
        left: 0,
        top: 0,
      },
      rect: {
        left: 0,
        top: 0,
      },
    });

    expect(
      updater({
        pageX: 6,
        pageY: 6,
      })
    ).toMatchObject({
      raw: {
        left: 6,
        top: 6,
      },
      delta: {
        left: 6,
        top: 6,
      },
      offset: {
        left: 6,
        top: 6,
      },
      rect: {
        left: 6,
        top: 6,
      },
    });

    expect(
      updater({
        pageX: 5,
        pageY: 5,
      })
    ).toMatchObject({
      delta: {
        left: -6,
        top: -6,
      },
      rect: {
        left: 0,
        top: 0,
      },
    });

    expect(
      updater({
        pageX: 1,
        pageY: 1,
      })
    ).toMatchObject({
      delta: {
        left: 0,
        top: 0,
      },
      rect: {
        left: 0,
        top: 0,
      },
    });

    expect(
      updater({
        pageX: -1,
        pageY: -1,
      })
    ).toMatchObject({
      delta: {
        left: 0,
        top: 0,
      },
      rect: {
        left: 0,
        top: 0,
      },
    });

    expect(
      updater({
        pageX: -5,
        pageY: -5,
      })
    ).toMatchObject({
      delta: {
        left: 0,
        top: 0,
      },
      rect: {
        left: 0,
        top: 0,
      },
    });

    expect(
      updater({
        pageX: -6,
        pageY: -6,
      })
    ).toMatchObject({
      delta: {
        left: -6,
        top: -6,
      },
      rect: {
        left: -6,
        top: -6,
      },
    });

    expect(
      updater({
        pageX: -8,
        pageY: -8,
      })
    ).toMatchObject({
      delta: {
        left: -2,
        top: -2,
      },
      rect: {
        left: -8,
        top: -8,
      },
    });

    expect(
      updater({
        pageX: 8,
        pageY: 8,
      })
    ).toMatchObject({
      delta: {
        left: 16,
        top: 16,
      },
      rect: {
        left: 8,
        top: 8,
      },
    });
  });

  test("basic scale 0.5", () => {
    const rect1 = {
      key: "a",
      left: 0,
      top: 0,
      width: 100,
      height: 100,
    };

    const rect2 = {
      key: "b",
      left: 0,
      top: 0,
      width: 100,
      height: 100,
    };

    const refLine = createRefLine({
      rects: [rect1],
    });

    const scale = 0.5;

    const updater = refLine.adsorbCreator({
      current: rect2,
      pageX: 0,
      pageY: 0,
      distance: 5,
      scale,
    });

    expect(
      updater({
        pageX: 3 * scale,
        pageY: 3 * scale,
      })
    ).toMatchObject({
      delta: {
        left: 0,
        top: 0,
      },
      rect: {
        left: 0,
        top: 0,
      },
    });

    expect(
      updater({
        pageX: 5 * scale,
        pageY: 5 * scale,
      })
    ).toMatchObject({
      delta: {
        left: 0,
        top: 0,
      },
      rect: {
        left: 0,
        top: 0,
      },
    });

    expect(
      updater({
        pageX: 6 * scale,
        pageY: 6 * scale,
      })
    ).toMatchObject({
      delta: {
        left: 6,
        top: 6,
      },
      rect: {
        left: 6,
        top: 6,
      },
    });

    expect(
      updater({
        pageX: 5 * scale,
        pageY: 5 * scale,
      })
    ).toMatchObject({
      delta: {
        left: -6,
        top: -6,
      },
      rect: {
        left: 0,
        top: 0,
      },
    });

    expect(
      updater({
        pageX: 1 * scale,
        pageY: 1 * scale,
      })
    ).toMatchObject({
      delta: {
        left: 0,
        top: 0,
      },
      rect: {
        left: 0,
        top: 0,
      },
    });

    expect(
      updater({
        pageX: -1 * scale,
        pageY: -1 * scale,
      })
    ).toMatchObject({
      delta: {
        left: 0,
        top: 0,
      },
      rect: {
        left: 0,
        top: 0,
      },
    });

    expect(
      updater({
        pageX: -5 * scale,
        pageY: -5 * scale,
      })
    ).toMatchObject({
      delta: {
        left: 0,
        top: 0,
      },
      rect: {
        left: 0,
        top: 0,
      },
    });

    expect(
      updater({
        pageX: -6 * scale,
        pageY: -6 * scale,
      })
    ).toMatchObject({
      delta: {
        left: -6,
        top: -6,
      },
      rect: {
        left: -6,
        top: -6,
      },
    });

    expect(
      updater({
        pageX: -8 * scale,
        pageY: -8 * scale,
      })
    ).toMatchObject({
      delta: {
        left: -2,
        top: -2,
      },
      rect: {
        left: -8,
        top: -8,
      },
    });

    expect(
      updater({
        pageX: 8 * scale,
        pageY: 8 * scale,
      })
    ).toMatchObject({
      delta: {
        left: 16,
        top: 16,
      },
      rect: {
        left: 8,
        top: 8,
      },
    });
  });

  test("basic disable adsorb", () => {
    const rect1 = {
      key: "a",
      left: 0,
      top: 0,
      width: 100,
      height: 100,
    };

    const rect2 = {
      key: "b",
      left: 0,
      top: 0,
      width: 100,
      height: 100,
    };

    const refLine = createRefLine({
      rects: [rect1],
    });

    const updater = refLine.adsorbCreator({
      current: rect2,
      pageX: 0,
      pageY: 0,
      distance: 5,
      disableAdsorb: true,
    });

    expect(
      updater({
        current: rect2,
        pageX: 3,
        pageY: 3,
      })
    ).toMatchObject({
      delta: {
        left: 3,
        top: 3,
      },
      rect: {
        left: 3,
        top: 3,
      },
    });

    expect(
      updater({
        current: rect2,
        pageX: 3,
        pageY: 3,
        disableAdsorb: false,
      })
    ).toMatchObject({
      delta: {
        left: 0,
        top: 0,
      },
      rect: {
        left: 0,
        top: 0,
      },
    });
  });

  test("adsorb double-count", () => {
    const rect1 = {
      height: 218.99997003816793,
      key: "a",
      left: 68.7278,
      rotate: 0,
      top: 392.66171498091603,
      width: 150.7963,
    };

    const rect2 = {
      height: 203.999977245509,
      key: "b",
      left: 114.56103333333331,
      rotate: 0,
      top: 130.18114471057896,
      width: 106.29640000000002,
    };

    const refLine = createRefLine({
      rects: [rect1],
    });

    const updater = refLine.adsorbCreator({
      current: rect2,
      pageX: 727,
      pageY: 245,
      distance: 5,
    });

    updater({
      pageX: 729,
      pageY: 256,
    });

    const r1 = updater({
      pageX: 728,
      pageY: 256,
    });

    const r2 = updater({
      pageX: 728,
      pageY: 256,
    });

    expect(r1).toMatchObject({
      delta: { left: -3.333333333333343, top: 0 },
    });

    expect(r2).toMatchObject({
      delta: { left: 0, top: 0 },
    });
  });

  test("adsorb precision 01", () => {
    const rect1 = {
      height: 218.99997003816793,
      key: "a",
      left: 68.7278,
      rotate: 0,
      top: 392.66171498091603,
      width: 150.7963,
    };

    const rect2 = {
      height: 203.999977245509,
      key: "b",
      left: 113.22769999999997,
      rotate: 0,
      top: 157.86464561147974,
      width: 106.29640000000002,
    };

    const refLine = createRefLine({
      rects: [rect1],
    });

    const updater = refLine.adsorbCreator({
      current: rect2,
      pageX: 758,
      pageY: 307,
      distance: 5,
      scale: 0.69375,
    });

    updater({
      pageX: 750,
      pageY: 312,
    });

    updater({
      pageX: 751,
      pageY: 312,
    });

    const r1 = updater({
      pageX: 752,
      pageY: 312,
    });

    const r2 = updater({
      pageX: 753,
      pageY: 312,
    });

    expect(r1).toMatchObject({
      delta: { left: 1.441441441441441, top: 0 },
    });

    expect(r2).toMatchObject({
      delta: { left: 1.441441441441441, top: 0 },
    });

    const r3 = updater({
      pageX: 754,
      pageY: 312,
    });
    expect(r3).toMatchObject({
      delta: { left: 7.207207207207233, top: 0 },
    });

    const r4 = updater({
      pageX: 755,
      pageY: 312,
    });
    expect(r4).toMatchObject({
      delta: { left: 0, top: 0 },
    });

    const r5 = updater({
      pageX: 756,
      pageY: 312,
    });
    expect(r5).toMatchObject({
      delta: { left: 0, top: 0 },
    });
  });
  test("adsorb precision 02", () => {
    const rect1 = {
      height: 218.99997003816793,
      key: "a",
      left: 68.7278,
      rotate: 0,
      top: 392.66171498091603,
      width: 150.7963,
    };

    const rect2 = {
      height: 203.999977245509,
      key: "bba",
      left: 90.97774999999999,
      rotate: 0,
      top: 185.94658848633475,
      width: 106.29640000000002,
    };

    const refLine = createRefLine({
      rects: [rect1],
    });

    const scale = 0.58625;

    const updater = refLine.adsorbCreator({
      current: rect2,
      pageX: 794,
      pageY: 276,
      distance: 5,
      scale,
    });

    updater({
      pageX: 795,
      pageY: 272,
    });

    updater({
      pageX: 794,
      pageY: 272,
    });

    const r1 = updater({
      pageX: 794,
      pageY: 271,
    });

    const r2 = updater({
      pageX: 794,
      pageY: 272,
    });

    expect(r1).toMatchObject({
      delta: { left: 0, top: -1.7057569296375448 },
    });

    expect(r2).toMatchObject({
      delta: { left: 0, top: 1.7057569296375448 },
    });

    const r3 = updater({
      pageX: 794,
      pageY: 273,
    });
    expect(r3).toMatchObject({
      delta: { left: 0, top: 1.7057569296375164 },
    });

    const r4 = updater({
      pageX: 794,
      pageY: 274,
    });
    expect(r4).toMatchObject({
      delta: { left: 0, top: 1.7057569296375164 },
    });

    const r5 = updater({
      pageX: 794,
      pageY: 275,
    });
    expect(r5).toMatchObject({
      delta: { left: 0, top: 6.126663108347287 },
    });

    const r6 = updater({
      pageX: 794,
      pageY: 276,
    });
    expect(r6).toMatchObject({
      delta: { left: 0, top: 0 },
    });
  });
});
