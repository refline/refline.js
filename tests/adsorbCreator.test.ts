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
});
