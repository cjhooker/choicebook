import React, { Component } from 'react';
import './Story.css';
import Markdown from 'markdown-to-jsx';
import { RouteComponentProps, Link } from 'react-router-dom';
import * as dataAccess from "../../DataAccess/data-access";
import * as pageRepository from "../../DataAccess/pageRepository";

interface StoryState {
  title: string;
  description: string;
  beginningPageId: string;
}

interface StoryProps extends RouteComponentProps<any> {
}

class Story extends Component<StoryProps, StoryState> {
  constructor(props: any) {
    super(props);
    this.state = { beginningPageId: "", title: "Loading...", description: "" };
  }

  componentDidMount() {
    this.getInfo();
  }

  getInfo = () => {
    const storyId = this.props.match.params.storyId;

    dataAccess.getStory(storyId)
      .then((data: any) => {
        this.setState({ title: data.title, description: data.description });
      })
      .catch((error: any) => console.log(error));

    pageRepository.getBeginningPageId(storyId)
      .then((beginningPageId: any) => {
        this.setState({ beginningPageId });
      })
      .catch((error: any) => console.log(error));
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
