import React, { Component } from "react";
import "./Page.css";
import Markdown from "markdown-to-jsx";
import { RouteComponentProps, Link } from "react-router-dom";
import * as pageRepository from "../../DataAccess/pageRepository";
import * as choiceRepository from "../../DataAccess/choiceRepository";
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

    pageRepository
      .getPage(pageId)
      .then((data: PageData) => {
        this.setState({
          page: data
        });
      })
      .catch((error: any) => console.log(error));

    choiceRepository
      .getChoicesForPage(pageId)
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
    let saveTextPromise = pageRepository.savePage(this.state.page);

    let saveChoicesPromise = choiceRepository.saveChoices(this.state.choices);

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
  
  ViewMode = () => {
    const { storyId, text, isEnding } = this.state.page;
    const { ChoiceList } = this;

    return (
      <>
        <Markdown options={{ forceBlock: true }}>{text}</Markdown>
        {isEnding ? <p className="theEnd">THE END</p> : ""}
        <ChoiceList />
        <Link to={`/story/${storyId}`}>
          Go back to the beginning of this story
        </Link>
      </>
    );
  };

  EditMode = () => {
    const { text, isEnding } = this.state.page;
    const { ChoiceList } = this;

    return (
      <>
        <textarea value={text} onChange={this.changeText} />
        <span>
          <input
            type="checkbox"
            checked={isEnding}
            onChange={this.changeIsEnding}
          />
          Is this page an ending?
        </span>
        <ChoiceList />
        <button className="save-button" onClick={this.save}>
          Save
        </button>
      </>
    );
  };

  ChoiceList = () => {
    const { isEditMode, choices } = this.state;

    return (
      <ul className="choices">
        {choices.map(choice => (
          <li key={choice.choiceId}>
            <Choice
              choiceId={choice.choiceId}
              targetPageId={choice.targetPageId}
              text={choice.text}
              isEditMode={isEditMode}
              onTextEdited={this.onChoiceTextEdited}
            />
          </li>
        ))}
      </ul>
    );
  };

  Footer = () => {
    const { isEditMode } = this.state;
    const { storyId } = this.state.page;
    const { pageId } = this.props.match.params;

    return (
      <div className="footer">
      <span>Page {pageId}</span>
      <span>Story {storyId}</span>
      <span>
        {isEditMode ? (
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
    )
  }

  render() {
    const { isEditMode } = this.state;
    const { EditMode, ViewMode, Footer } = this;

    return (
      <div className="Page">
        {isEditMode ? <EditMode /> : <ViewMode />}
        <Footer />
      </div>
    );
  }
}

export default Page;
