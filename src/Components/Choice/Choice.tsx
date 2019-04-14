import React, { Component, ReactNode } from "react";
import { Link } from "react-router-dom";
import "./Choice.scss";

interface ChoiceProps {
  choiceId: string;
  targetPageId: string;
  text: string;
  isEditMode: boolean;
  onTextEdited: Function;
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

  ViewMode = () => {
    return (
      <Link to={`/page/${this.props.targetPageId}`}>{this.props.text}</Link>
    );
  };

  // TODO: Remove a choice
  // TODO: Change where a choice continues to
  EditMode = () => {
    return (
      <input
        type="text"
        className="editChoice"
        value={this.state.text}
        onChange={this.editText}
      />
    );
  };

  render() {
    const { ViewMode, EditMode } = this;
    const { isEditMode } = this.props;

    return <>{isEditMode ? <EditMode /> : <ViewMode />}</>;
  }
}

export default Choice;
