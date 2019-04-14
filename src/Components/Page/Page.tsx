import React, { Component } from "react";
import "./Page.css";
import Markdown from "markdown-to-jsx";
import { RouteComponentProps, Link } from "react-router-dom";
import * as dataAccess from "../../DataAccess/data-access";
import ChoiceData from "../../DataAccess/DTOs/ChoiceData";
import Choice from "../Choice/Choice";
import PageData from "../../DataAccess/DTOs/PageData";

interface PageState {
  page: PageData;
  choices: ChoiceData[];
  isEditMode: boolean;
}

interface PageProps extends RouteComponentProps<any> {}

class Page extends Component<PageProps, PageState> {
  previousState: {};

  constructor(props: any) {
    super(props);
    this.state = {
      page: {
        pageId: "",
        text: "Loading...",
        storyId: "",
        isEnding: false,
        isBeginning: false
      } as PageData,
      choices: [],
      isEditMode: false
    };
    this.previousState = this.state;

    this.changeText = this.changeText.bind(this);
    this.changeIsEnding = this.changeIsEnding.bind(this);
    this.save = this.save.bind(this);
    this.edit = this.edit.bind(this);
    this.view = this.view.bind(this);
    this.onChoiceTextEdited = this.onChoiceTextEdited.bind(this);
  }

  componentDidUpdate(
    prevProps: PageProps,
    prevState: PageState,
    snapshot: any
  ) {
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

    dataAccess
      .getPage(pageId)
      .then((data: PageData) => {
        this.setState({
          page: data
        });
      })
      .catch((error: any) => console.log(error));

    dataAccess
      .getPageChoices(pageId)
      .then((choices: any) => {
        this.setState({ choices });
      })
      .catch((error: any) => console.log(error));
  };

  edit() {
    this.previousState = this.state;
    this.setState({ isEditMode: true });
  }

  view() {
    this.setState({ ...this.previousState, isEditMode: false });
  }

  save() {
    let saveTextPromise = dataAccess.savePage(this.state.page);

    let saveChoicesPromise = dataAccess.saveChoices(this.state.choices);

    Promise.all([saveTextPromise, saveChoicesPromise])
      .then(() => {
        this.previousState = this.state;
      })
      .catch(error => console.log(error));
  }

  changeText(event: any) {
    this.setState({ page: { ...this.state.page, text: event.target.value } });
  }

  changeIsEnding(event: any) {
    this.setState({
      page: { ...this.state.page, isEnding: event.target.checked }
    });
  }

  onChoiceTextEdited(choiceId: string, newText: string) {
    const choice = this.state.choices.filter(
      choice => choice.choiceId == choiceId
    )[0];
    choice.text = newText;
    choice.wasEdited = true;
    console.log(this.state.choices);
  }

  renderText() {
    if (this.state.isEditMode) {
      return (
        <>
          <textarea value={this.state.page.text} onChange={this.changeText} />
          <span>
            <input
              type="checkbox"
              checked={this.state.page.isEnding}
              onChange={this.changeIsEnding}
            />
            Is this page an ending?
          </span>
        </>
      );
    } else {
      return (
        <>
          <Markdown options={{ forceBlock: true }}>{this.state.page.text}</Markdown>
          {this.state.page.isEnding ? <p className="theEnd">THE END</p> : ""}
        </>
      );
    }
  }

  renderChoices() {
    return (
      <ul className="choices">
        {this.state.choices.map(choice => (
          <li key={choice.choiceId}>
            <Choice
              choiceId={choice.choiceId}
              targetPageId={choice.targetPageId}
              text={choice.text}
              isEditMode={this.state.isEditMode}
              onTextEdited={this.onChoiceTextEdited}
            />
          </li>
        ))}
        {this.state.isEditMode ? (
          ""
        ) : (
          <li key="beginning">
            <Link to={`/story/${this.state.page.storyId}`}>
              Go back to the beginning of this story
            </Link>
          </li>
        )}
      </ul>
    );
  }

  render() {
    return (
      <div className="Page">
        {this.renderText()}
        {this.renderChoices()}
        {this.state.isEditMode ? (
          <button className="save-button" onClick={this.save}>
            Save
          </button>
        ) : (
          ""
        )}
        <div className="footer">
          <span>Page {this.props.match.params.pageId}</span>
          <span>Story {this.state.page.storyId}</span>
          <span>
            {this.state.isEditMode ? (
              <button className="button small" onClick={this.view}>
                View this page
              </button>
            ) : (
              <button className="button small" onClick={this.edit}>
                Edit this page
              </button>
            )}
          </span>
        </div>
      </div>
    );
  }
}

export default Page;
