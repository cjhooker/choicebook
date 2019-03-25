import React, { Component } from 'react';
import './Page.css';
import Markdown from 'markdown-to-jsx';
import { RouteComponentProps, Link } from 'react-router-dom';
import * as dataAccess from "../DataAccess/data-access";
import IChoice from "../Choice/IChoice";

interface IPageEditState {
  text: string;
  storyId: string;
  choices: IChoice[];
}

interface IPageEditProps extends RouteComponentProps<any> {
}

class PageEdit extends Component<IPageEditProps, IPageEditState> {
  constructor(props: any) {
    super(props);
    this.state = { text: "Loading...", storyId: "", choices: [] };

    this.changeText = this.changeText.bind(this);
    this.save = this.save.bind(this);
  }

  componentDidUpdate(prevProps: IPageEditProps, prevState: IPageEditState, snapshot: any) {
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
        this.setState({ text: data.text, storyId: data.storyId });
      })
      .catch(error => console.log(error));

    dataAccess.getPageChoices(pageId)
      .then((choices: any) => {
        this.setState({ choices });
      })
      .catch(error => console.log(error))
  }

  save() {
    dataAccess.savePageText(this.props.match.params.pageId, this.state.text)
      .catch(error => console.log(error));
  }

  changeText(event: any) { 
    this.setState({text: event.target.value});
  } 

  render() {
    return (
      <div className="Page">
        <textarea value={this.state.text} onChange={this.changeText}>
        </textarea>
        <button onClick={this.save}>Save</button>
        <div className="footer">
          <span>Page {this.props.match.params.pageId}</span>
          <span>Story {this.state.storyId}</span>
          <span><Link to={`/page/${this.props.match.params.pageId}`}>View this page</Link></span>
        </div>
      </div>
    );
  }
}

export default PageEdit;
