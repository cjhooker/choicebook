import React, { Component } from 'react';
import './App.scss';  
import * as dataAccess from "../../DataAccess/dataAccess"

class App extends Component<any, any> {
  constructor(props: any) {
    super(props);
    dataAccess.initialize();
  }

  render() {
    return (
      <div className="App">
        <div>
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default App;
