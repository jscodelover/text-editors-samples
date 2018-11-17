import React, { Component } from "react";
import { Editor, EditorState, RichUtils } from "draft-js";

const styleMap = {
  STRIKETHROUGH: {
    textDecoration: "line-through"
  }
};

class App extends Component {
  constructor() {
    super();
    this.state = {
      editorState: EditorState.createEmpty()
    };
  }

  onChange = editorState => {
    this.setState({ editorState });
  };

  handleKeyCommand = command => {
    console.log(command);
    const newState = RichUtils.handleKeyCommand(
      this.state.editorState,
      command
    );

    if (newState) {
      this.onChange(newState);
      return "handled";
    }

    return "not-handled";
  };

  onUnderlineClick = () => {
    this.onChange(
      RichUtils.toggleInlineStyle(this.state.editorState, "UNDERLINE")
    );
  };

  onlineThroughClick = () => {
    this.onChange(
      RichUtils.toggleInlineStyle(this.state.editorState, "STRIKETHROUGH")
    );
  };

  onToggleCode = () => {
    this.onChange(RichUtils.toggleCode(this.state.editorState));
  };

  render() {
    return (
      <div
        style={{
          width: "650px",
          border: "2px solid",
          height: "700px",
          padding: "5px",
          margin: "10px"
        }}
      >
        <button onClick={this.onUnderlineClick}>Underline</button>
        <button onClick={this.onlineThroughClick}>Strike Through</button>
        <button onClick={this.onToggleCode}>Code Block</button>
        <Editor
          editorState={this.state.editorState}
          handleKeyCommand={this.handleKeyCommand}
          onChange={this.onChange}
          customStyleMap={styleMap}
          placeholder="Tell us story"
        />
      </div>
    );
  }
}

export default App;
