import React, { Component, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import './Choice.css';

interface IChoiceProps {
  choiceId: string;
  targetPageId: string;
  text: string;
  isEditMode: boolean;
  onTextEdited: Function;
}

interface IChoiceState {
  text: string;
}

class Choice extends Component<IChoiceProps, IChoiceState> {

  constructor(props: IChoiceProps) {
    super(props);
    this.state = { text: props.text };

    this.editText = this.editText.bind(this);
  }

  editText(event: any) {
    this.setState({ text: event.target.value });
    this.props.onTextEdited(this.props.choiceId, event.target.value);
  }

  renderViewMode(): ReactNode {
    return (
      <Link to={`/page/${this.props.targetPageId}`}>{this.props.text}</Link>
    )
  }

  renderEditMode(): ReactNode {
    return (
      <input type="text" className="edit-choice" value={this.state.text} onChange={this.editText}></input>
    )
  }

  render() {
    if (this.props.isEditMode) {
      return this.renderEditMode();
    } else {
      return this.renderViewMode();
    }
  }
}

export default Choice;