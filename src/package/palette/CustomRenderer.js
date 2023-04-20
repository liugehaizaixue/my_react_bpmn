// import BpmnRenderer from "bpmn-js/lib/draw/BpmnRenderer";
import BaseRenderer from "diagram-js/lib/draw/BaseRenderer";
import { customElements, customConfig, hasLabelElements } from "../utils/util";
import {
  append as svgAppend,
  // attr as svgAttr,
  create as svgCreate,
} from "tiny-svg";

const HIGH_PRIORITY = 1500;
// export default function CustomRenderer(config, eventBus, styles, pathMap, canvas, textRenderer) {
//   BpmnRenderer.call(this, config, eventBus, styles, pathMap, canvas, textRenderer, 2000);

//   this.handlers["label"] = function() {
//     return null;
//   };
// }

// const F = function() {}; // 核心，利用空对象作为中介；
// F.prototype = BpmnRenderer.prototype; // 核心，将父类的原型赋值给空对象F；
// CustomRenderer.prototype = new F(); // 核心，将 F的实例赋值给子类；
// CustomRenderer.prototype.constructor = CustomRenderer; // 修复子类CustomRenderer的构造器指向，防止原型链的混乱；

export default class CustomRenderer extends BaseRenderer {
  constructor(eventBus, bpmnRenderer, modeling, pathMap) {
    super(eventBus, HIGH_PRIORITY);
    this.pathMap = pathMap;
    this.bpmnRenderer = bpmnRenderer;
    this.modeling = modeling;
  }

  canRender(element) {
    // ignore labels
    return !element.labelTarget;
  }

  drawShape(parentNode, element) {
    const type = element.type; // 获取到类型
    var url, attr;
    let nodeType = element.businessObject.$attrs.nodeType;
    if (nodeType == null) {
      nodeType = "engine1";
    }
    if (customElements.includes(type)) {
      // or customConfig[type]
      //    if(type==='bpmn:Task'){
      //          if(nodeType){
      //             ({ url, attr } = customConfig[type][nodeType])
      //          }else{
      //             ({ url, attr } = customConfig[type][0])
      //          }

      //    }
      //    else{

      ({ url, attr } = customConfig[type]);
      //}

      const customIcon = svgCreate("image", {
        ...attr,
        href: url,
      });

      // console.log(href)
      element["width"] = attr.width; // 这里我是取了巧, 直接修改了元素的宽高
      element["height"] = attr.height;
      svgAppend(parentNode, customIcon);
      // 判断是否有name属性来决定是否要渲染出label
      if (
        type === "bpmn:UserTask" ||
        type === "bpmn:ServiceTask" ||
        type === "bpmn:Task"
      ) {
        if (element.businessObject.loopCharacteristics) {
          // 渲染循环标志
          var markerPath = this.pathMap.getScaledPath("MARKER_LOOP", {
            xScaleFactor: 1,
            yScaleFactor: 1,
            containerWidth: element.width,
            containerHeight: element.height,
            position: {
              mx: 1,
              my: 0.2,
              //   mx: ((element.width / 2 ) / element.width),
              //   my: (element.height - 7) / element.height
            },
          });
          const p = svgCreate("path", {
            d: markerPath,
            "data-marker": "loop",
            style:
              "fill: white; stroke-width: 1px; stroke: black; stroke-linecap: round; stroke-miterlimit: 0.5;",
          });
          svgAppend(parentNode, p);
        }
      }

      if (!hasLabelElements.includes(type) && element.businessObject.name) {
        const text = svgCreate("text", {
          x: attr.x + attr.width / 2,
          y: attr.y + attr.height + 20,
          "font-size": "14",
          fill: "#000",
          "text-anchor": "middle",
        });

        text.innerHTML = element.businessObject.name;
        svgAppend(parentNode, text);
        console.log(text);
      }

      return customIcon;
    }
    const shape = this.bpmnRenderer.drawShape(parentNode, element);
    return shape;
  }

  getShapePath(shape) {
    return this.bpmnRenderer.getShapePath(shape);
  }
}

CustomRenderer.$inject = ["eventBus", "bpmnRenderer", "modeling", "pathMap"];
