import { createRefLine } from "../src";

describe("test adsorbCreator", () => {
  test("basic", () => {
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
        pageX: 5,
        pageY: 5,
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
        pageX: 6,
        pageY: 6,
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
});
