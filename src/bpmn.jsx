import React from 'react';
import BpmnModeler from 'bpmn-js/lib/Modeler'
// import BpmnJS from 'bpmn-js/dist/bpmn-navigated-viewer.production.min.js';
import 'bpmn-js/dist/assets/diagram-js.css' // 左边工具栏以及编辑节点的样式
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css'
import CustomPaletteProvider from "./package/palette"; //palette 里面包含了renderer
import './package/css/app.css'
import CustomContentPadProvider from "./package/content-pad";
import DesignerHeader from "./component/header";
import DefaultEmptyXML from "./package/defaultEmpty";
import "diagram-js-minimap/assets/diagram-js-minimap.css";
import minimapModule from "diagram-js-minimap";

import lintModule from 'bpmn-js-bpmnlint';
import "bpmn-js-bpmnlint/dist/assets/css/bpmn-js-bpmnlint.css"
// import * as bpmnlintConfig from './packed-config';
import { resolver, rules } from "./package/BpmnLint/bpmnlint";

export default class ReactBpmn extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      processId : null ,
      processName :null ,
      previewResultL:null,
      previewType:null,
      previewModelVisible:null
    };

    this.containerRef = React.createRef();
  }

  componentDidMount() {

    const {
      url,
      diagramXML
    } = this.props;

    const container = this.containerRef.current;

    this.bpmnModeler = new BpmnModeler({ 
      container:container,
      // propertiesPanel: {
      //   parent: '#js-properties-panel'
      // } 
      keyboard: {
        bindTo: window // 或者window，注意与外部表单的键盘监听事件是否冲突
      },
      linting: {
        // active: this.getUrlParam('linting'), // 默认开启规则校验
        active:true,
        bpmnlint: {
          config: {
            rules: { ...rules, "task-required": "error" }
          },
          resolver
        }
      },
      additionalModules: [
        // 左边工具栏以及节点
        CustomPaletteProvider,
        CustomContentPadProvider,
        minimapModule,
        lintModule
    ]
    });

    this.props.initFinish(this.bpmnModeler) //初始化bpmnModeler后传给父节点（进而传给属性面板panel）

    // const that = this
    // this.bpmnModeler.on('linting.toggle', function(event) {
    //   const active = event.active;
    //   that.setUrlParam('linting', active);
    // });

    this.bpmnModeler.on('import.done', (event) => {
      const {
        error,
        warnings
      } = event;

      if (error) {
        return this.handleError(error);
      }

      this.bpmnModeler.get('canvas').zoom('fit-viewport');

      return this.handleShown(warnings);
    });

    if (url) {
      return this.fetchDiagram(url);
    }

    if (diagramXML) {
      return this.displayDiagram(diagramXML);
    }else{
      this.createNewDiagram(null).then(() =>
        this.bpmnModeler.get("canvas").zoom(1, "auto")
      );
    }
    this.bpmnModeler.get("minimap").close();
  }

  componentWillUnmount() {
    this.bpmnModeler.destroy();
  }

  componentDidUpdate(prevProps, prevState) {
    const {
      props,
      state
    } = this;

    if (props.url !== prevProps.url) {
      return this.fetchDiagram(props.url);
    }

    const currentXML = props.diagramXML || state.diagramXML;

    const previousXML = prevProps.diagramXML || prevState.diagramXML;

    if (currentXML && currentXML !== previousXML) {
      return this.displayDiagram(currentXML);
    }
  }

  displayDiagram(diagramXML) {
    this.bpmnModeler.importXML(diagramXML);
  }

  fetchDiagram(url) {

    this.handleLoading();

    fetch(url)
      .then(response => response.text())
      .then(text => this.setState({ diagramXML: text }))
      .catch(err => this.handleError(err));
  }

  handleLoading() {
    const { onLoading } = this.props;

    if (onLoading) {
      onLoading();
    }
  }

  handleError(err) {
    const { onError } = this.props;

    if (onError) {
      onError(err);
    }
  }

  handleShown(warnings) {
    const { onShown } = this.props;

    if (onShown) {
      onShown(warnings);
    }
  }
  

      /* 创建新的流程图 */
  async createNewDiagram(xml) {
    // 将字符串转换成图显示出来
    let newId = this.state.processId || `Process_${new Date().getTime()}`;
    let newName = this.state.processName || `process${new Date().getTime()}`;
    let xmlString = xml || DefaultEmptyXML(newId, newName);
    try {
      console.log(`
      newId = ${newId}
      newName = ${newName}
      `)
      let { warnings } = await this.bpmnModeler.importXML(xmlString);
      if (warnings && warnings.length) {
        warnings.forEach((warn) => console.warn(warn));
      }
      this.addModelerListener();
    } catch (e) {
      console.error(`[Process Designer Warn]: ${e.message || e}`);
    }
  }
  
  addModelerListener() {
      //监听元素事件
      // const bpmnjs = this.bpmnModeler;
      const that = this;
      // 这里我是用了一个forEach给modeler上添加要绑定的事件
      const events = [
        "shape.added",
        "shape.move.end",
        "shape.removed",
        "connect.end",
        "connect.move",
      ];
      events.forEach(function (event) {
        that.bpmnModeler.on(event, (e) => {
          console.log("foreach",event)
          // var elementRegistry = bpmnjs.get("elementRegistry");
          // var shape = e.element ? elementRegistry.get(e.element.id) : e.shape;
        });
      });
    }
//流程校验===================================================================

  getUrlParam = (name) => {
      console.log("geturl")
      var url = new URL(window.location.href);

      return url.searchParams.has(name);
  }
  // setUrlParam = (name, value) => {
  //   console.log("seturl")
  //   var url = new URL(window.location.href);

  //   if (value) {
  //       url.searchParams.set(name, 1);
  //   } else {
  //       url.searchParams.delete(name);
  //   }

  //   window.history.replaceState({}, null, url.href);
  // }

// ==========================================================================
  processRestart() {
    this.recoverable = false;
    this.revocable = false;
    this.createNewDiagram(null).then(() =>
      this.bpmnModeler.get("canvas").zoom(1, "auto")
    );
  }
  // 下载流程图到本地
  async downloadProcess(type, name) {
    try {
      const _this = this;
      // 按需要类型创建文件并下载
      if (type === "xml" || type === "bpmn") {
        const { err, xml } = await this.bpmnModeler.saveXML();
        // 读取异常时抛出异常
        if (err) {
          console.error(`[Process Designer Warn ]: ${err.message || err}`);
        }
        let { href, filename } = _this.setEncoded(
          type.toUpperCase(),
          name,
          xml
        );
        downloadFunc(href, filename);
      } else {
        const { err, svg } = await this.bpmnModeler.saveSVG();
        // 读取异常时抛出异常
        if (err) {
          return console.error(err);
        }
        let { href, filename } = _this.setEncoded("SVG", name, svg);
        downloadFunc(href, filename);
      }
    } catch (e) {
      console.error(`[Process Designer Warn ]: ${e.message || e}`);
    }
    // 文件下载方法
    function downloadFunc(href, filename) {
      if (href && filename) {
        let a = document.createElement("a");
        a.download = filename; //指定下载的文件名
        a.href = href; //  URL对象
        a.click(); // 模拟点击
        URL.revokeObjectURL(a.href); // 释放URL 对象
      }
    }
  }
   // 根据所需类型进行转码并返回下载地址
  setEncoded(type, filename = "diagram", data) {
    const encodedData = encodeURIComponent(data);
    return {
      filename: `${filename}.${type}`,
      href: `data:application/${
        type === "svg" ? "text/xml" : "bpmn20-xml"
      };charset=UTF-8,${encodedData}`,
      data: data,
    };
  }
  processRedo() {
    this.bpmnModeler.get("commandStack").redo();
  }
  processUndo() {
    this.bpmnModeler.get("commandStack").undo();
  }
  processZoomIn(zoomStep = 0.1) {
    let newZoom = Math.floor(this.defaultZoom * 100 + zoomStep * 100) / 100;
    if (newZoom > 4) {
      throw new Error(
        "[Process Designer Warn ]: The zoom ratio cannot be greater than 4"
      );
    }
    this.defaultZoom = newZoom;
    this.bpmnModeler.get("canvas").zoom(this.defaultZoom);
  }
  processZoomOut(zoomStep = 0.1) {
    let newZoom = Math.floor(this.defaultZoom * 100 - zoomStep * 100) / 100;
    if (newZoom < 0.2) {
      throw new Error(
        "[Process Designer Warn ]: The zoom ratio cannot be less than 0.2"
      );
    }
    this.defaultZoom = newZoom;
    this.bpmnModeler.get("canvas").zoom(this.defaultZoom);
  }
  processZoomTo(newZoom = 1) {
    if (newZoom < 0.2) {
      throw new Error(
        "[Process Designer Warn ]: The zoom ratio cannot be less than 0.2"
      );
    }
    if (newZoom > 4) {
      throw new Error(
        "[Process Designer Warn ]: The zoom ratio cannot be greater than 4"
      );
    }
    this.defaultZoom = newZoom;
    this.bpmnModeler.get("canvas").zoom(newZoom);
  }
  processReZoom() {
    this.defaultZoom = 1;
    this.bpmnModeler.get("canvas").zoom("fit-viewport", "auto");
  }
  elementsAlign(align) {
    const Align = this.bpmnModeler.get("alignElements");
    const Selection = this.bpmnModeler.get("selection");
    const SelectedElements = Selection.get();
    Align.trigger(SelectedElements, align)
  }
  async previewProcessXML() {
    let res =await this.bpmnModeler.saveXML({ format: true })
    return res
  }
  async checkLint(){
    console.log("checklint")
    var result = await this.bpmnModeler
        .get("linting")
        .lint()
        .then((data) => {
          console.log(data);
          let errorStatus = Object.values(data)
            .flat(Infinity)
            .some((item) => item.category === "error");
          if (errorStatus) {
            return false;
          } else {
            return true;
          }
        });
      console.log(result)
      return result;
  }

  render() {
    return (
      <div className="react-bpmn-diagram-container" ref={ this.containerRef }>
        <DesignerHeader 
        Restart={() => this.processRestart()} 
        download={() => this.downloadProcess()}
        // processReZoom={() => this.processReZoom()}
        // processZoomOut={() => this.processZoomOut()}
        // processZoomIn={() => this.processZoomIn()}
        processRedo={() => this.processRedo()}
        processUndo={() => this.processUndo()}
        elementsAlign={(e) => this.elementsAlign(e)}
        previewProcessXML={() => this.previewProcessXML()}
        checkLint={() => this.checkLint()}
        />
      </div>
    );
  }
}
