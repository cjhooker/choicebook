import React, { Component } from "react";
import "./Story.css";
import Markdown from "markdown-to-jsx";
import { RouteComponentProps, Link } from "react-router-dom";
import * as storyRepository from "../../DataAccess/storyRepository";
import StoryData from "../../DataAccess/DTOs/StoryData";

interface StoryState {
  story: StoryData;
}

interface StoryProps extends RouteComponentProps<any> {}

class Story extends Component<StoryProps, StoryState> {
  constructor(props: any) {
    super(props);
    this.state = {
      story: { storyId: "", beginningPageId: "", title: "Loading...", description: "" }
    };
  }

  componentDidMount() {
    this.getInfo();
  }

  getInfo = () => {
    const storyId = this.props.match.params.storyId;

    storyRepository
      .getStory(storyId)
      .then((data: StoryData) => {
        this.setState({ story: data });
      })
      .catch((error: any) => console.log(error));
  };

  render() {
    const { title, description, beginningPageId } = this.state.story;

    return (
      <div className="Story">
        <h1>{title}</h1>

        <Markdown options={{ forceBlock: true }}>
          {description}
        </Markdown>

        <div className="choices">
          <Link to={`/page/${beginningPageId}`}>
            Start this story
          </Link>
        </div>
      </div>
    );
  }
}

export default Story;
