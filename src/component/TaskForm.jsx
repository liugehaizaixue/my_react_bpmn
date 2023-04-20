// import { PositiveIntField } from './react-component/form-inputs.tsx';
import React from 'react';
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import WaitForForm from './waitforForm';
import GoToPlaceForm from './gotoplaceForm';
// import ButtonGroup from '@material-ui/core/ButtonGroup';
// import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
// import RedoIcon from '@material-ui/icons/Redo';
// import UndoIcon from '@material-ui/icons/Undo';
// import ReplayIcon from '@material-ui/icons/Replay';


export default class TaskForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      TaskCategory:""
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
  TaskCategoryChanged(e){
     this.setState({
      TaskCategory: e.target.value
    })
    let modeling=this.props.modeler.get("modeling")
    modeling.updateProperties(this.bpmnElement, {
      TaskCategory: e.target.value || null,
    });
  }

  render() {
    let TaskCategory = this.state.TaskCategory
    let Form = null
    if(TaskCategory==="clean"){
      console.log("clean")
    }else if(TaskCategory==="patrol"){
      console.log("patrol")
    }else if(TaskCategory==="delivery"){
      console.log("delivery")
    }else if(TaskCategory==="pickup"){
      console.log("pickup")
    }else if(TaskCategory==="waitfor"){
      console.log("waitfor")
      Form = <WaitForForm modeler={this.props.modeler}/>
    }
    else if(TaskCategory==="gotoplace"){
      console.log("gotoplace")
      Form = <GoToPlaceForm modeler={this.props.modeler}/>
    }
    return (
      <Card>
        <Button>Task-Information</Button>
        <TextField
            select
            id="task-type"
            label="Task Category"
            variant="outlined"
            fullWidth
            margin="normal"
            value={this.state.TaskCategory}
            onChange={ e => this.TaskCategoryChanged(e) }
          >
            <MenuItem value="clean">Clean</MenuItem>
            <MenuItem value="patrol">Loop</MenuItem>
            <MenuItem value="delivery">Delivery</MenuItem>
            <MenuItem value="pickup">PickUp</MenuItem>
            <MenuItem value="waitfor">WaitFor</MenuItem>
            <MenuItem value="gotoplace">GoToPlace</MenuItem>
        </TextField>
        {Form}
      </Card>
  );
  }
}
