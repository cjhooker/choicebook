import React, { Component } from "react";
import "./Page.scss";
import Markdown from "markdown-to-jsx";
import { RouteComponentProps, Link } from "react-router-dom";
import * as pageRepository from "../../DataAccess/pageRepository";
import * as choiceRepository from "../../DataAccess/choiceRepository";
import ChoiceData from "../../DataAccess/DTOs/ChoiceData";
import Choice from "../Choice/Choice";
import PageData from "../../DataAccess/DTOs/PageData";
import Button from "../UI/Button/Button";
import ChoiceCollection, {
  ChoiceStatus
} from "../../DataAccess/DTOs/ChoiceCollection";

interface PageState {
  page: PageData;
  choices: ChoiceCollection;
  isEditMode: boolean;
  isSaving: boolean;
  newChoiceText: string;
}

interface PageProps extends RouteComponentProps<any> {}

class Page extends Component<PageProps, PageState> {
  previousPageData: PageData;

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
      choices: new ChoiceCollection([]),
      isEditMode: false,
      isSaving: false,
      newChoiceText: ""
    };
    this.previousPageData = this.state.page;

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
      .then((choices: ChoiceData[]) => {
        this.setState({ choices: ChoiceCollection.fromChoiceData(choices) });
      })
      .catch((error: any) => console.log(error));
  };

  edit() {
    this.previousPageData = this.state.page;
    this.setState({ isEditMode: true });
  }

  view() {
    this.setState({ page: this.previousPageData, isEditMode: false });
  }

  save() {
    this.setState({ isSaving: true });

    let saveTextPromise = pageRepository.savePage(this.state.page);

    let saveChoicesPromise = choiceRepository
      .saveChoices(this.state.choices)
      .then(choices => this.setState({ choices }));

    Promise.all([saveTextPromise, saveChoicesPromise])
      .then(() => {
        this.previousPageData = this.state.page;
      })
      .catch(error => console.log(error))
      .finally(() => this.setState({ isSaving: false }));
  }

  addChoice = () => {
    const { choices, page, newChoiceText } = this.state;

    let choice: Partial<ChoiceData> = {
      sourcePageId: page.pageId, 
      text: newChoiceText
    };

    this.setState({ choices: choices.add(choice), newChoiceText: "" });
  };

  editNewChoiceText = (event: any) => {
    this.setState({ newChoiceText: event.target.value });
  };

  changeText(event: any) {
    this.setState({ page: { ...this.state.page, text: event.target.value } });
  }

  changeIsEnding(event: any) {
    this.setState({
      page: { ...this.state.page, isEnding: event.target.checked }
    });
  }

  onChoiceTextEdited(choiceId: string, newText: string) {
    const choice = this.state.choices.getChoiceData(choiceId);
    choice.text = newText;

    this.setState({ choices: this.state.choices.update(choice) });
  }

  onChoiceDeleted = (choiceId: string) => {
    this.setState({ choices: this.state.choices.delete(choiceId) });
  };

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
        <Button
          className="saveButton"
          onClick={this.save}
          text="Save"
          isBusy={this.state.isSaving}
          isBusyText="Saving..."
        />
      </>
    );
  };

  // TODO: Specify where a new choice continues to
  ChoiceList = () => {
    const { isEditMode } = this.state;
    const choices = this.state.choices.getUndeleted();

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
              onChoiceDeleted={this.onChoiceDeleted}
            />
          </li>
        ))}
        {isEditMode ? (
          <li key="new">
            <input
              type="text"
              className="editChoice"
              value={this.state.newChoiceText}
              onChange={this.editNewChoiceText}
            />
            <Button
              text="Add a new choice"
              className="small newChoiceButton"
              onClick={this.addChoice}
            />
          </li>
        ) : (
          ""
        )}
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
            <Button
              className="small"
              onClick={this.view}
              text="View this page"
            />
          ) : (
            <Button
              className="small"
              onClick={this.edit}
              text="Edit this page"
            />
          )}
        </span>
      </div>
    );
  };

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
