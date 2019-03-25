import React, { Component } from 'react';
import './App.css';
import Story from '../Story/Story';
import * as firebase from "firebase"

class App extends Component<any, any> {
  constructor(props: any) {
    super(props);
    firebase.initializeApp({
      apiKey: ' AIzaSyBi2KbEFSMemDyHnYuKnISxWibsrMbx3fE',
      authDomain: 'choicebook-cjh.firebaseapp.com',
      projectId: 'choicebook-cjh'
    });
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
