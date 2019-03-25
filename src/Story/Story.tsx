import React, { Component } from 'react';
import './Story.css';
import Page from '../Page/Page';
import * as firebase from "firebase"
import Markdown from 'markdown-to-jsx';
import { RouteComponentProps, Link } from 'react-router-dom';

interface IStoryState {
  title: string;
  description: string;
  beginningPageId: string;
}

interface IStoryProps extends RouteComponentProps<any> {
}

class Story extends Component<IStoryProps, IStoryState> {
  constructor(props: any) {
    super(props);
    this.state = { beginningPageId: "", title: "Loading...", description: "" };
  }

  componentDidMount() {
    this.getInfo();
  }

  getInfo = () => {
    const storyId = this.props.match.params.storyId;
    const db = firebase.firestore();
    var docRef = db.collection("stories").doc(storyId);

    // Get the story from firebase
    docRef.get().then((doc) => {
      if (doc.exists) {
        let data = doc.data();
        console.log("Document data:", doc.data());
        if (data !== undefined) {
          this.setState({ title: data.title, description: data.description });
        }
      } else {
        console.log("No such document!");
      }
    }).catch(function (error) {
      console.log("Error getting document:", error);
    });

    // Get the story's beginning page
    var pagesRef = db.collection("pages");
    var query = pagesRef
      .where("storyId", "==", storyId)
      .where("isBeginning", "==", true)
      ;

    query.get().then((querySnapshot) => {
      if (querySnapshot.size == 0) {
        console.log("Error: No beginning page");
        return;
      }

      if (querySnapshot.size > 1) {
        console.log("Error: More than one beginning page");
        return;
      }
       
      this.setState({ beginningPageId: querySnapshot.docs[0].id });
    })
    .catch(function (error) {
      console.log("Error getting documents: ", error);
    });
  }

  render() {
    return (
      <div className="Story">
        <h1>{this.state.title}</h1>

        <Markdown options={{ forceBlock: true }}>{this.state.description}</Markdown>
        
        <div className="choices">
          <Link to={`/page/${this.state.beginningPageId}`}>Start this story</Link>
        </div>
      </div>
    );
  }
}

export default Story;
