import React, { Component } from 'react';
import './Page.css';
import * as firebase from "firebase"
import Markdown from 'markdown-to-jsx';
import { RouteComponentProps, Link } from 'react-router-dom';
import * as dataAccess from "../DataAccess/data-access";
import IChoice from "../Choice/IChoice";

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

    dataAccess.getPage(pageId)
      .then((data: any) => {
        this.setState({ text: data.text, storyId: data.storyId });
      })
      .catch(error => console.log(error));

    dataAccess.getPageChoices(pageId)
      .then((docs: any) => {
        let choices: IChoice[] = docs.map((doc: any) => {
          const data = doc.data();
          let choice = { targetPageId: data.targetPageId, text: data.text } as IChoice;
          return choice;
        });
        this.setState({ choices });
      })
      .catch(error => console.log(error))
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
