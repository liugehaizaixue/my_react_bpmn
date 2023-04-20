import React from 'react';
import Card from '@material-ui/core/Card';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { PositiveIntField } from './react-component/form-inputs.tsx';
// import Button from '@material-ui/core/Button';
// import ButtonGroup from '@material-ui/core/ButtonGroup';
// import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
// import RedoIcon from '@material-ui/icons/Redo';
// import UndoIcon from '@material-ui/icons/Undo';
// import ReplayIcon from '@material-ui/icons/Replay';


export default class ProcessForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Category:"",
      Priority:"",
      Annotation:"",
      StartTime:new Date(new Date().toString().split('GMT')[0]+' UTC').toISOString().split('.')[0],
    };
    this.containerRef = React.createRef();
  }
  componentDidMount(){
    this.resetForm()
  }
  resetForm(){
    this.bpmnElement=window?.bpmnInstances?.bpmnElement;
    if(this.bpmnElement){
      let businessObj=this.bpmnElement.businessObject
      let attrs = businessObj.$attrs
      this.setState({
        // Category:attrs?.Category?attrs.Category:""
        ...attrs
      })
    }
  }
  CategoryChanged(e){
    this.setState({
      Category: e.target.value
    })
    let modeling=this.props.modeler.get("modeling")
    modeling.updateProperties(this.bpmnElement, {
      Category: e.target.value || null,
    });
  }
  PriorityChanged(e){
    this.setState({
      Priority: e.target.value
    })
    let modeling=this.props.modeler.get("modeling")
    modeling.updateProperties(this.bpmnElement, {
      Priority: e.target.value || null,
    });
  }
  AnnotationChanged(e){
    this.setState({
      Annotation: e.target.value
    })
    let modeling=this.props.modeler.get("modeling")
    modeling.updateProperties(this.bpmnElement, {
      Annotation: e.target.value || null,
    });
  }
  StartTimeChanged(e){
    this.setState({
      StartTime: e.target.value
    })
    let modeling=this.props.modeler.get("modeling")
    modeling.updateProperties(this.bpmnElement, {
      StartTime: e.target.value || null,
    });
  }
  clearForm(){
    this.setState({
      Category:"",
      Priority:"",
      Annotation:"",
      StartTime:new Date(new Date().toString().split('GMT')[0]+' UTC').toISOString().split('.')[0],
    })
    let modeling=this.props.modeler.get("modeling")
    modeling.updateProperties(this.bpmnElement, {
      Category:"",
      Priority:"",
      Annotation:"",
      StartTime:new Date(new Date().toString().split('GMT')[0]+' UTC').toISOString().split('.')[0],
    });
  }


  render() {
    return (
      <Card>
        <Button onClick={()=>{this.clearForm()}}>Process-Information</Button>
        <TextField id="Category" label="Category" variant="outlined" value={this.state.Category} onChange={ e => this.CategoryChanged(e) }/>
        <PositiveIntField id="Priority"
            label="Priority"
            margin="normal"
            value={this.state.Priority}
            onChange={ e => this.PriorityChanged(e) }
            />
        <TextField
          id="Start-Time"
          label="Start-Time"
          type="datetime-local"
          value={this.state.StartTime}
          onChange={ e => this.StartTimeChanged(e) }
          // defaultValue="2017-05-24T10:30"
          // className={classes.textField}
          InputLabelProps={{
            shrink: true,
          }}
         />
        <TextField
          id="Annotation"
          label="Text Annotation"
          multiline
          minRows={4}
          placeholder='Text Annotation'
          value={this.state.Annotation}
          onChange={ e => this.AnnotationChanged(e) }
          variant="outlined"
        />
      </Card>
  );
  }
}
