import React, { Component } from 'react';
import './Page.css';
import Markdown from 'markdown-to-jsx';
import { RouteComponentProps, Link } from 'react-router-dom';
import * as dataAccess from "../DataAccess/data-access";
import IChoice from "../Choice/IChoice";
import Choice from "../Choice/Choice";

interface IPageState {
  text: string;
  storyId: string;
  choices: IChoice[];
  isEnding: boolean;
  isEditMode: boolean;
}

interface IPageProps extends RouteComponentProps<any> {
}

class Page extends Component<IPageProps, IPageState> {
  previousState: {}

  constructor(props: any) {
    super(props);
    this.state = { text: "Loading...", storyId: "", choices: [], isEnding: false, isEditMode: false };
    this.previousState = this.state;

    this.changeText = this.changeText.bind(this);
    this.changeIsEnding = this.changeIsEnding.bind(this);
    this.save = this.save.bind(this);
    this.edit = this.edit.bind(this);
    this.view = this.view.bind(this);
    this.onChoiceTextEdited = this.onChoiceTextEdited.bind(this);
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
        // !!data.isEnding is necessary to coerce undefined into false
        // Perhaps instead we should make sure isEnding is always set?
        this.setState({ text: data.text, storyId: data.storyId, isEnding: !!data.isEnding });
      })
      .catch(error => console.log(error));

    dataAccess.getPageChoices(pageId)
      .then((choices: any) => {
        this.setState({ choices });
      })
      .catch(error => console.log(error))
  }

  edit() {
    this.previousState = this.state;
    this.setState({ isEditMode: true });
  }

  view() {
    this.setState({ ...this.previousState, isEditMode: false });
  }

  save() {
    // TODO: Need to save isEnding value!

    let saveTextPromise = dataAccess.savePageText(this.props.match.params.pageId, this.state.text);

    let saveChoicesPromise = dataAccess.saveChoices(this.state.choices);

    Promise.all([saveTextPromise, saveChoicesPromise])
      .then(() => {
        this.previousState = this.state;
      })
      .catch(error => console.log(error));
  }

  changeText(event: any) {
    this.setState({ text: event.target.value });
  }

  changeIsEnding(event: any) {
    this.setState({ isEnding: event.target.checked })
  }
  
  onChoiceTextEdited(choiceId: string, newText: string) {
    const choice = this.state.choices.filter(choice => choice.choiceId == choiceId)[0];
    choice.text = newText;
    choice.wasEdited = true;
    console.log(this.state.choices);
  }

  renderText() {
    if (this.state.isEditMode) {
      return (
        <>
          <textarea value={this.state.text} onChange={this.changeText}></textarea>
          <span><input type="checkbox" checked={this.state.isEnding} onChange={this.changeIsEnding} />Is this page an ending?</span>
        </>
      )
    } else {
      return (
        <>
          <Markdown options={{ forceBlock: true }}>
            {this.state.text}
          </Markdown>
          {this.state.isEnding ? <p className="theEnd">THE END</p> : ""}
        </>
      )
    }
  }

  renderChoices() {
    return (
      <ul className="choices">
        {this.state.choices.map((choice) => (
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
        {this.state.isEditMode ? "" : <li key="beginning"><Link to={`/story/${this.state.storyId}`}>Go back to the beginning of this story</Link></li>}
      </ul>
    )
  }

  render() {
    return (
      <div className="Page">
        {this.renderText()}
        {this.renderChoices()}
        {this.state.isEditMode ?
          <button className="save-button" onClick={this.save}>Save</button> : ""}
        <div className="footer">
          <span>Page {this.props.match.params.pageId}</span>
          <span>Story {this.state.storyId}</span>
          <span>
            {this.state.isEditMode ?
              <button className="button small" onClick={this.view}>View this page</button> :
              <button className="button small" onClick={this.edit}>Edit this page</button>
            }
          </span>
        </div>
      </div >
    );
  }
}

export default Page;
