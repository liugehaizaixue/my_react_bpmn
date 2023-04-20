import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import "./component/component.css";
import ReactBpmn from "./bpmn";
import SimpleCard from "./component/Accordion";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modeler: null,
    };
    this.containerRef = React.createRef();
  }
  initFinish = (modeler) => {
    this.setState({
      modeler,
    });
  };
  render() {
    return (
      <div className="app">
        <div className="my-designer">
          <div className="my-container">
            <ReactBpmn
              id="container"
              className="my-canvas"
              // diagramXML={xmlstr}
              initFinish={this.initFinish}
            />
          </div>
        </div>
        <SimpleCard modeler={this.state.modeler} />
      </div>
    );
  }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
// root.render(<ReactBpmn />);
