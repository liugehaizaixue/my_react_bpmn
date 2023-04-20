import { PositiveIntField } from './react-component/form-inputs.tsx';
import React from 'react';
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
// import TextField from '@material-ui/core/TextField';
// import Autocomplete from '@material-ui/lab/Autocomplete';
// import ButtonGroup from '@material-ui/core/ButtonGroup';
// import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
// import RedoIcon from '@material-ui/icons/Redo';
// import UndoIcon from '@material-ui/icons/Undo';
// import ReplayIcon from '@material-ui/icons/Replay';


export default class WaitForForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Duration:"",
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
        ...attrs
      })
    }
  }
  DurationChanged(e){
    this.setState({
      Duration: e.target.value
    })
    let modeling=this.props.modeler.get("modeling")
    modeling.updateProperties(this.bpmnElement, {
      Duration: e.target.value || null,
    });
  }

  render() {
    return (
      <Card>
        <Button>Waitfor-Information</Button>
        <PositiveIntField id="duration"
            label="Duration"
            margin="normal"
            value={this.state.Duration}
            onChange={ e => this.DurationChanged(e) }
            />
      </Card>
  );
  }
}
