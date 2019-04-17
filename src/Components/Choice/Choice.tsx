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
  }

  ViewMode = () => {
    return (
      <Link to={`/page/${this.props.targetPageId}`}>{this.props.text}</Link>
    );
  };

  // TODO: Change where a choice continues to
  EditMode = () => {
    return (
      <>
        <input
          type="text"
          className="editChoice"
          value={this.state.text}
          onChange={this.editText}
        />
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
