import "./styles.css";
import React from "react";
import Background from "./Background";
import { find, random } from "lodash";
import { RefLine } from "../../src";
import { listen } from "dom-helpers";
import withHooks from "with-component-hooks";
import RefLineDemo from "./RefLine";
let seq = 100;
const adsorbHLines = [
  {
    key: "a",
    offset: 100,
  },
  {
    key: "b",
    offset: 400,
  },
];
const adsorbVLines = adsorbHLines;

const defaultNodes = [
  {
    key: "node1",
    left: 100,
    top: 280,
    width: 158,
    height: 65,
    rotate: 0,
  },
  {
    key: "node2",
    left: 200,
    top: 200,
    width: 158,
    height: 65,
  },
  {
    key: "node3",
    left: 300,
    top: 80,
    width: 150,
    height: 65,
  },
  {
    key: "node4",
    left: 50,
    top: 100,
    width: 150,
    height: 65,
  },
];

class App extends React.Component {
  state = {
    checked: true,
    current: null,
    delta: {
      left: 0,
      top: 0,
    },
    nodes: localStorage.getItem("nodes")
      ? JSON.parse(localStorage.getItem("nodes")!)
      : defaultNodes,
  };

  refline: RefLine | null = null;

  handleNodeMouseDown(key: string, e: MouseEvent) {
    const { nodes, checked } = this.state;

    const startX = e.pageX;
    const startY = e.pageY;
    const node = find(nodes, {
      key,
    }) as any;
    let startLeft = node!.left;
    let startTop = node!.top;

    const refline = new RefLine({
      rects: nodes,
      adsorbHLines,
      adsorbVLines,
      // lineFilter: line => {
      //   if (line.position === "hc" || line.position === "vc") return false;
      //   return true;
      // },
    });

    this.refline = refline;

    const updater = refline.adsorbCreator({
      current: node,
      pageX: startX,
      pageY: startY,
      distance: 10,
    });

    const un1 = listen(window as any, "mousemove", (e) => {
      const currentX = e.pageX;
      const currentY = e.pageY;
      const leftOffset = currentX - startX;
      const topOffset = currentY - startY;

      const left = startLeft + leftOffset;
      const top = startTop + topOffset;

      let delta = {
        left: left - node!.left,
        top: top - node!.top,
      };

      const o = {
        ...delta,
      };

      // 参考线吸附逻辑
      if (checked) {
        const ret = updater({
          pageX: currentX,
          pageY: currentY,
        });

        delta = ret.delta;
      }

      node.left += delta.left;
      node.top += delta.top;

      this.setState({
        delta: o,
        current: node,
        nodes: [...nodes],
      });
    });
    const un2 = listen(window as any, "mouseup", () => {
      un1();
      un2();

      this.setState({
        current: null,
      });
    });
  }

  handleAddRect = () => {
    const left = random(50, 400);
    const width = random(50, 200);
    const height = random(20, 80);
    const rotate = random(0, 359);

    const node = {
      key: "node" + seq++,
      left,
      top: left,
      width,
      height,
      rotate,
    };

    this.state.nodes.push(node);

    this.forceUpdate();
  };

  handleReset = () => {
    localStorage.removeItem("nodes");
    this.setState({
      nodes: defaultNodes,
    });
  };

  render() {
    const { nodes, current, checked, delta } = this.state;

    React.useEffect(() => {
      localStorage.setItem("nodes", JSON.stringify(nodes));
    }, [nodes]);

    return (
      <div className="App">
        <div className="container">
          <div className="conf">
            <label>
              开启吸附
              <input
                type="checkbox"
                name="checked"
                onChange={(e) => {
                  this.setState({
                    checked: e.target.checked,
                  });
                }}
                checked={checked}
              />
            </label>
            <button onClick={this.handleAddRect}>新增节点</button>
            <button onClick={this.handleReset}>重置</button> ({delta.left.toFixed(0)},
            {delta.top.toFixed(0)})
          </div>
          <Background />
          {adsorbHLines.map((line) => {
            return (
              <div
                data-type="h"
                key={line.key}
                style={{
                  position: "absolute",
                  left: 0,
                  top: line.offset,
                  right: 0,
                  height: 1,
                  background: "red",
                }}
              ></div>
            );
          })}
          {adsorbVLines.map((line) => {
            return (
              <div
                data-type="v"
                key={line.key}
                style={{
                  position: "absolute",
                  left: line.offset,
                  bottom: 0,
                  top: 0,
                  width: 1,
                  background: "red",
                }}
              ></div>
            );
          })}
          {nodes.map((node) => {
            return (
              <div
                className="node"
                onMouseDown={this.handleNodeMouseDown.bind(this, node.key) as any}
                id={node.key}
                key={node.key}
                style={{
                  left: node.left,
                  top: node.top,
                  width: node.width,
                  height: node.height,
                  transform: `rotate(${node.rotate || 0}deg)`,
                }}
              >
                {node.key}
              </div>
            );
          })}
          {/* 显示参考线 */}
          <RefLineDemo nodes={nodes} current={current as any} refline={this.refline} />
        </div>
      </div>
    );
  }
}

export default withHooks(App as any) as any;
