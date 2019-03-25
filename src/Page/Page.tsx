import React, { Component } from 'react';
import './Page.css';
import * as firebase from "firebase"
import Markdown from 'markdown-to-jsx';
import { RouteComponentProps, Link } from 'react-router-dom';

interface IChoice {
  targetPageId: string;
  text: string;
}

interface IPageState {
  text: string;
  storyId: string;
  choices: IChoice[];
}

interface IPageProps extends RouteComponentProps<any> {
}

class Page extends Component<IPageProps, IPageState> {
  constructor(props: any) {
    super(props);
    this.state = { text: "Loading...", storyId: "", choices: [] };
  }

  componentDidUpdate(prevProps: IPageProps, prevState: IPageState, snapshot: any) {
    var prevPageId = prevProps.match.params.pageId;
    if (prevPageId !== this.props.match.params.pageId) {
      this.getInfo();
    }
  }

  componentDidMount() {
    this.getInfo();
  }

  getInfo = () => {
    const pageId = this.props.match.params.pageId;
    const db = firebase.firestore();
    var docRef = db.collection("pages").doc(pageId);

    // Get the page from firebase
    docRef.get().then((doc) => {
      if (doc.exists) {
        let data = doc.data();
        if (data !== undefined) {
          this.setState({ text: data.text, storyId: data.storyId });
        }
      } else {
        console.log("No such document!");
      }
    }).catch(function (error) {
      console.log("Error getting document:", error);
    });

    // Get the page's choices from firebase
    var choicesRef = db.collection("choices");
    var query = choicesRef.where("sourcePageId", "==", pageId);

    query.get().then((querySnapshot) => {
      let choices: IChoice[] = querySnapshot.docs.map(doc => {
        const data = doc.data();
        let choice = { targetPageId: data.targetPageId, text: data.text } as IChoice;
        return choice;
      });
      this.setState({ choices });
    })
      .catch(function (error) {
        console.log("Error getting documents: ", error);
      });
  }

  render() {
    return (
      <div className="Page">
        <Markdown options={{ forceBlock: true }}>
          {this.state.text}
        </Markdown>
        <ul className="choices">
          {this.state.choices.map((choice, index) => (
            <li key={index}><Link to={`/page/${choice.targetPageId}`}>{choice.text}</Link></li>
          ))}
          <li key="beginning"><Link to={`/story/${this.state.storyId}`}>Go back to the beginning of this story</Link></li>
        </ul>
        <div className="footer">
          <span>Page {this.props.match.params.pageId}</span>
          <span>Story {this.state.storyId}</span>
        </div>
      </div>
    );
  }
}

export default Page;
