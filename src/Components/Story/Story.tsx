import React, { Component } from "react";
import "./Story.scss";
import Markdown from "markdown-to-jsx";
import { RouteComponentProps, Link } from "react-router-dom";
import * as storyRepository from "../../DataAccess/storyRepository";
import StoryData from "../../DataAccess/DTOs/StoryData";
import Page from "../Page/Page";
import StoryContext from "./StoryContext";

interface StoryState {
  story: StoryData;
}

interface StoryProps extends RouteComponentProps<any> {}

class Story extends Component<StoryProps, StoryState> {
  constructor(props: any) {
    super(props);
    this.state = {
      story: {
        storyId: "",
        beginningPageId: "",
        title: "Loading...",
        description: ""
      }
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

  StoryIntro = () => {
    const { title, description, beginningPageId } = this.state.story;
    const storyId = this.props.match.params.storyId;

    return (
      <div className="Story">
        <h1>{title}</h1>

        <Markdown options={{ forceBlock: true }}>{description}</Markdown>

        <div className="choices">
          <Link to={`/story/${storyId}/${beginningPageId}`}>
            Start this story
          </Link>
        </div>
      </div>
    );
  };

  render() {
    const { StoryIntro } = this;
    const { pageId, storyId } = this.props.match.params;

    return (
      <StoryContext.Provider value={{ story: this.state.story }}>
        {pageId === undefined ? <StoryIntro /> : <Page pageId={pageId} />}
      </StoryContext.Provider>
    );
  }
}

export default Story;
