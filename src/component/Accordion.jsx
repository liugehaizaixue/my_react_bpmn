import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
// import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Divider from "@material-ui/core/Divider"
// import WaitForForm from './waitforForm';
import ProcessForm from './processForm'; 
import TaskForm from './TaskForm';

export default class SimpleCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      elementId: "",
      elementType: "",
      elementName: "",
      elementBusinessObject: {}, // 元素 businessObject 镜像，提供给需要做判断的组件使用
    };
    this.containerRef = React.createRef();
  }
  componentDidMount() {
    this.initModels()
  }
  initModels() {
    // 初始化 modeler 以及其他 moddle
    if (!this.props.modeler) {
      // 避免加载时 流程图 并未加载完成
      this.timer = setTimeout(() => this.initModels(), 10);
      return;
    }
    if (this.timer) clearTimeout(this.timer);
    window.bpmnInstances = {
      modeler: this.props.modeler,
      modeling: this.props.modeler.get("modeling"),
      moddle: this.props.modeler.get("moddle"),
      eventBus: this.props.modeler.get("eventBus"),
      bpmnFactory: this.props.modeler.get("bpmnFactory"),
      elementRegistry: this.props.modeler.get("elementRegistry"),
      replace: this.props.modeler.get("replace"),
      selection: this.props.modeler.get("selection"),
    };
    this.getActiveElement();
  }
  getActiveElement() {
  // 初始第一个选中元素 bpmn:Process
    this.initFormOnChanged(null);
    this.props.modeler.on("import.done", (e) => {
      this.initFormOnChanged(null);
    });
    // 监听选择事件，修改当前激活的元素以及表单
    this.props.modeler.on("selection.changed", ({ newSelection }) => {
      this.initFormOnChanged(newSelection[0] || null);
    });
    this.props.modeler.on("element.changed", ({ element }) => {
      // 保证 修改 "默认流转路径" 类似需要修改多个元素的事件发生的时候，更新表单的元素与原选中元素不一致。
      if (element && element.id === this.state.elementId) {
        this.initFormOnChanged(element);
      }
    });
  }
    // 初始化数据
  initFormOnChanged(element) {
    let activatedElement = element;
    if (!activatedElement) {
      activatedElement =
        window.bpmnInstances.elementRegistry.find(
          (el) => el.type === "bpmn:Process"
        ) ??
        window.bpmnInstances.elementRegistry.find(
          (el) => el.type === "bpmn:Collaboration"
        );
    }
    if (!activatedElement) return;
    console.log(activatedElement)
    console.log(`
            ----------
    select element changed:
              id:  ${activatedElement.id}
            type:  ${activatedElement.businessObject.$type}
            ----------
            `);
    console.log("businessObject:" ,activatedElement.businessObject)
    window.bpmnInstances.bpmnElement = activatedElement;
    this.bpmnElement = activatedElement;
    setTimeout(() => {
      this.setState({
        elementId : activatedElement.id,
        elementName : activatedElement.businessObject.name?activatedElement.businessObject.name:"",
        elementType : activatedElement.type.split(":")[1] || "",
        elementBusinessObject : JSON.parse(
          JSON.stringify(activatedElement.businessObject)
        )
      })
    }, 100)
    this.addEventBusListener();
  }

  addEventBusListener() {
    const eventBus = this.props.modeler.get("eventBus");
    eventBus.on("element.click", function (e) {
      console.log(
        "点击了element",
        e.element.businessObject.id,
        e.element.businessObject.$type,
        e.element.businessObject.name
      );
    });
  }
  //==========================================
  NameChanged(e){
    this.setState({
     elementName: e.target.value
   })
    window.bpmnInstances.modeling.updateProperties(this.bpmnElement, {
        name: e.target.value || null,
    });
  }
  render() {
    let elementType= this.state.elementType
    let Form = null
    if(elementType==="Process"){
      Form=<ProcessForm modeler={this.props.modeler}/>
    }else if(elementType==="Task"){
      Form=<TaskForm modeler={this.props.modeler}/>
    }
    return (
    <Card className="panel-container">
      <CardContent>
        {/* <Typography className={classes.title} color="textSecondary" gutterBottom>
          Information
        </Typography> */}
        <Card>
        <form className="panel-form" noValidate autoComplete="off">
          <TextField id="Name" label="Name" variant="outlined" value={this.state.elementName} onChange={ e => this.NameChanged(e) }/>
          <TextField id="Id" label="ID" variant="outlined" value={this.state.elementId} disabled />
          <Divider />
        </form> 
        </Card>
        {Form}
      </CardContent>

    </Card>
  );
      }
}
