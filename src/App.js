import React, { Component } from "react";
import { EditorState, RichUtils } from "draft-js";
import Editor from "draft-js-plugins-editor";
import createEmojiPlugin from "draft-js-emoji-plugin";
import createHashtagPlugin from "draft-js-hashtag-plugin";
import "draft-js-emoji-plugin/lib/plugin.css";
import "draft-js-hashtag-plugin/lib/plugin.css";

const styleMap = {
  STRIKETHROUGH: {
    textDecoration: "line-through"
  }
};

// const imagePlugin = createImagePlugin();

const emojiPlugin = createEmojiPlugin();
const hashtagPlugin = createHashtagPlugin();

const { EmojiSuggestions, EmojiSelect } = emojiPlugin;

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
        <EmojiSelect />
        <Editor
          editorState={this.state.editorState}
          handleKeyCommand={this.handleKeyCommand}
          onChange={this.onChange}
          customStyleMap={styleMap}
          placeholder="Tell us story"
          plugins={[emojiPlugin, hashtagPlugin]}
        />
        <EmojiSuggestions />
      </div>
    );
  }
}

export default App;
