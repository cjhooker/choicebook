import React, { Component, ReactNode } from "react";
import { Link } from "react-router-dom";
import "./Choice.scss";
import Button from "../UI/Button/Button";

interface ChoiceProps {
  choiceId: string;
  targetPageId: string;
  text: string;
  isEditMode: boolean;
  onTextEdited: Function;
  onChoiceDeleted: Function;
}

interface ChoiceState {
  text: string;
}

class Choice extends Component<ChoiceProps, ChoiceState> {
  constructor(props: ChoiceProps) {
    super(props);
    this.state = { text: props.text };

    this.editText = this.editText.bind(this);
  }

  editText(event: any) {
    this.setState({ text: event.target.value });
    this.props.onTextEdited(this.props.choiceId, event.target.value);
  }

  delete = () => {
    this.props.onChoiceDeleted(this.props.choiceId);
  };

  ViewMode = () => {
    const { targetPageId, text } = this.props;

    return (
      <>
        {targetPageId !== undefined ? (
          <Link to={`/page/${targetPageId}`}>{text}</Link>
        ) : (
          <span>{text}</span>
        )}
      </>
    );
  };

  // TODO: Change where a choice continues to
  //       Need to store a list of all pages in current story
  //       Should be loaded once for the story and stored in state
  EditMode = () => {
    const { targetPageId } = this.props;

    return (
      <>
        <input
          type="text"
          className="editChoice"
          value={this.state.text}
          onChange={this.editText}
        />
        =>
        <span>{targetPageId === undefined ? "NOWHERE" : targetPageId}</span>
        <Button
          text="Delete"
          className="small deleteButton"
          onClick={this.delete}
        />
      </>
    );
  };

  render() {
    const { ViewMode, EditMode } = this;
    const { isEditMode } = this.props;

    return <>{isEditMode ? <EditMode /> : <ViewMode />}</>;
  }
}

export default Choice;
