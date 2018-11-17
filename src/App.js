import React, { Component } from "react";
import { EditorState, RichUtils } from "draft-js";
import Editor from "draft-js-plugins-editor";
import createEmojiPlugin from "draft-js-emoji-plugin";
import createHashtagPlugin from "draft-js-hashtag-plugin";
import createMentionPlugin, {
  defaultSuggestionsFilter
} from "draft-js-mention-plugin";
import "draft-js-emoji-plugin/lib/plugin.css";
import "draft-js-hashtag-plugin/lib/plugin.css";
import "draft-js-mention-plugin/lib/plugin.css";
import "draft-js/dist/Draft.css";

const styleMap = {
  STRIKETHROUGH: {
    textDecoration: "line-through"
  }
};

const user = [
  { name: "manisha basra", id: "sdjvhbsdjvhhsbvh" },
  { name: "nehal basra", id: "sdjvhbsdjAscdbvh" },
  { name: "rinki malhotra", id: "sdjvhbsdjvhcabvh" }
];

// const imagePlugin = createImagePlugin();

const emojiPlugin = createEmojiPlugin();
const hashtagPlugin = createHashtagPlugin();
const mentionPlugin = createMentionPlugin();

const { EmojiSuggestions, EmojiSelect } = emojiPlugin;
const { MentionSuggestions } = mentionPlugin;

class App extends Component {
  constructor() {
    super();
    this.state = {
      editorState: EditorState.createEmpty(),
      suggestions: user
    };
  }

  onSearchChange = ({ value }) => {
    this.setState({
      suggestions: defaultSuggestionsFilter(value, user)
    });
  };

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

  focus = () => {
    this.editor.focus();
  };

  render() {
    return (
      <div>
        <button onClick={this.onUnderlineClick}>Underline</button>
        <button onClick={this.onlineThroughClick}>Strike Through</button>
        <button onClick={this.onToggleCode}>Code Block</button>
        <EmojiSelect />
        <div
          style={{
            width: "650px",
            border: "2px solid",
            height: "700px",
            padding: "5px",
            margin: "10px"
          }}
          onClick={this.focus}
        >
          <Editor
            editorState={this.state.editorState}
            handleKeyCommand={this.handleKeyCommand}
            onChange={this.onChange}
            customStyleMap={styleMap}
            placeholder="Tell a story..."
            plugins={[emojiPlugin, hashtagPlugin, mentionPlugin]}
            ref={element => {
              this.editor = element;
            }}
          />
          <EmojiSuggestions />
          <MentionSuggestions
            onSearchChange={this.onSearchChange}
            suggestions={this.state.suggestions}
          />
        </div>
      </div>
    );
  }
}

export default App;
