import { PositiveIntField } from './react-component/form-inputs.tsx';
import React from 'react';
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
// import Autocomplete from '@material-ui/lab/Autocomplete';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
// import ButtonGroup from '@material-ui/core/ButtonGroup';
// import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
// import RedoIcon from '@material-ui/icons/Redo';
// import UndoIcon from '@material-ui/icons/Undo';
// import ReplayIcon from '@material-ui/icons/Replay';


export default class GoToPlaceForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Orientation:"",
      Destination:"",
      Waypoints:[
        "place1",
        "place2",
        "place3",
        "place4",
        "place5"
      ]
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
  OrientationChanged(e){
    this.setState({
       Orientation: e.target.value
    })
    let modeling=this.props.modeler.get("modeling")
    modeling.updateProperties(this.bpmnElement, {
       Orientation: e.target.value || null,
    });
  }
  DestinationChanged(e){
    this.setState({
       Destination:e.target.value
    })
    let modeling=this.props.modeler.get("modeling")
    modeling.updateProperties(this.bpmnElement, {
       Destination:e.target.value || null,
    });
  }
  clearForm(){
    this.setState({
      Orientation:"",
      Destination:"",
    })
    let modeling=this.props.modeler.get("modeling")
    modeling.updateProperties(this.bpmnElement, {
      Orientation:"",
      Destination:"",
    });
  }
  render() {
    return (
      <Card>
        <Button onClick={()=>{this.clearForm()}}>GoToPlace-Information</Button>
        <FormControl >
          <InputLabel id="demo-simple-select-label">Destination</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={this.state.Destination}
              onChange={e=>this.DestinationChanged(e)}
            >
              {this.state.Waypoints.map((waypoint) => (
            <MenuItem key={waypoint} value={waypoint} >
              {waypoint}
            </MenuItem>
          ))}
          </Select>
        </FormControl>
        <PositiveIntField id="Orientation"
            label="Orientation"
            margin="normal"
            value={this.state.Orientation}
            onChange={ e => this.OrientationChanged(e) }
            />
      </Card>
  );
  }
}
