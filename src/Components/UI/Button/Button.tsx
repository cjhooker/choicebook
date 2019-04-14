import React, { Component } from "react";
import "./Button.scss";

interface ButtonProps {
  onClick: () => void;
  className: string;
  text: string;
  isBusy: boolean;
  isBusyText: string;
}

class Button extends Component<ButtonProps, any> {
  static defaultProps = {
    isBusy: false,
    isBusyText: "..."
  };

  render() {
    const { className, onClick, text, isBusy, isBusyText } = this.props;

    return (
      <button
        className={`button ${className}`}
        onClick={onClick}
        disabled={isBusy}
      >
        {isBusy ? isBusyText : text}
      </button>
    );
  }
}

export default Button;
