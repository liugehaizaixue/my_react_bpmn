import React from 'react';
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import RedoIcon from '@material-ui/icons/Redo';
import UndoIcon from '@material-ui/icons/Undo';
import DoneAllIcon from '@material-ui/icons/DoneAll';
import ReplayIcon from '@material-ui/icons/Replay';
import VisibilityIcon from '@material-ui/icons/Visibility';
import Preview from './preview';
// import "./component.css"

export default class DesignerHeader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      content:""
    };
    this.previewRef = React.createRef();
  }
  async openPreviewXML(){
    this.props.previewProcessXML().then(({xml})=>{
      this.setState({
        content:xml
      })
      this.previewRef.current.handleClickOpen();
    })
  }
  render() {
    return (
      <Card>
        <ButtonGroup color="secondary" aria-label="outlined secondary button group">
        <Button  startIcon={<CloudDownloadIcon/>} onClick={()=>{console.log('你点击了CloudDownload');this.props.download()}}></Button>     
        <Button  startIcon={<UndoIcon/>} onClick={()=>{console.log('你点击了undo');this.props.processUndo()}}></Button>
        <Button  startIcon={<ReplayIcon/>} onClick={()=>{console.log('你点击了Restart');this.props.Restart()}}></Button>
        <Button  startIcon={<RedoIcon/>} onClick={()=>{console.log('你点击了redo');this.props.processRedo()}}></Button>     
      </ButtonGroup>
      <ButtonGroup
        color="secondary" aria-label="outlined secondary button group"
      >
{/*       
        <Button onClick={()=>{this.props.elementsAlign("left")}}>left</Button>
        <Button onClick={()=>{this.props.elementsAlign("right")}}>right</Button>
        <Button onClick={()=>{this.props.elementsAlign("top")}}>top</Button>
        <Button onClick={()=>{this.props.elementsAlign("bottom")}}>bottom</Button>
        <Button onClick={()=>{this.props.elementsAlign("center")}}>center</Button>
        <Button onClick={()=>{this.props.elementsAlign("middle")}}>middle</Button> */}
      </ButtonGroup>
      <ButtonGroup
        color="secondary" aria-label="outlined secondary button group"
      >
        <Button startIcon={<VisibilityIcon/>} onClick={()=>{this.openPreviewXML()}}>预览xml</Button>
        <Button startIcon={<DoneAllIcon/>} onClick={()=>{this.props.checkLint()}}>检验</Button>
      </ButtonGroup>
        <Preview ref={this.previewRef} content={this.state.content}/>
    </Card>
  );
  }
}
