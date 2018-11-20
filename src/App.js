import * as React from "react";
import { EditorState, RichUtils, convertToRaw } from "draft-js";
import Editor, { createEditorStateWithText } from "draft-js-plugins-editor";
import createEmojiPlugin from "draft-js-emoji-plugin";
import createHashtagPlugin from "draft-js-hashtag-plugin";
import createMentionPlugin, {
  defaultSuggestionsFilter
} from "draft-js-mention-plugin";
import createInlineToolbarPlugin, {
  Separator
} from "draft-js-inline-toolbar-plugin";
import {
  ItalicButton,
  BoldButton,
  UnderlineButton,
  CodeButton,
  HeadlineOneButton,
  HeadlineTwoButton,
  HeadlineThreeButton,
  UnorderedListButton,
  OrderedListButton,
  BlockquoteButton,
  CodeBlockButton
} from "draft-js-buttons";

import "draft-js-emoji-plugin/lib/plugin.css";
import "draft-js-hashtag-plugin/lib/plugin.css";
import "draft-js-mention-plugin/lib/plugin.css";
import "draft-js-inline-toolbar-plugin/lib/plugin.css";
import "draft-js/dist/Draft.css";
import "./App.css";

class HeadlinesPicker extends React.Component {
  componentDidMount() {
    setTimeout(() => {
      window.addEventListener("click", this.onWindowClick);
    });
  }

  componentWillUnmount() {
    window.removeEventListener("click", this.onWindowClick);
  }

  onWindowClick = () =>
    // Call `onOverrideContent` again with `undefined`
    // so the toolbar can show its regular content again.
    this.props.onOverrideContent(undefined);

  render() {
    const buttons = [HeadlineOneButton, HeadlineTwoButton, HeadlineThreeButton];
    return (
      <div>
        {buttons.map((
          Button,
          i // eslint-disable-next-line
        ) => (
          <Button key={i} {...this.props} />
        ))}
      </div>
    );
  }
}

class HeadlinesButton extends React.Component {
  // When using a click event inside overridden content, mouse down
  // events needs to be prevented so the focus stays in the editor
  // and the toolbar remains visible  onMouseDown = (event) => event.preventDefault()
  onMouseDown = event => event.preventDefault();

  onClick = () =>
    // A button can call `onOverrideContent` to replace the content
    // of the toolbar. This can be useful for displaying sub
    // menus or requesting additional information from the user.
    this.props.onOverrideContent(HeadlinesPicker);

  render() {
    return (
      <div onMouseDown={this.onMouseDown} className="headlineButtonWrapper">
        <button onClick={this.onClick} className="headlineButton">
          H
        </button>
      </div>
    );
  }
}

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

const inlineToolbarPlugin = createInlineToolbarPlugin({
  structure: [
    BoldButton,
    ItalicButton,
    UnderlineButton,
    CodeButton,
    Separator,
    HeadlinesButton,
    UnorderedListButton,
    OrderedListButton,
    BlockquoteButton,
    CodeBlockButton
  ]
});

const emojiPlugin = createEmojiPlugin();
const hashtagPlugin = createHashtagPlugin();
const mentionPlugin = createMentionPlugin();
const { InlineToolbar } = inlineToolbarPlugin;

const { EmojiSuggestions, EmojiSelect } = emojiPlugin;
const { MentionSuggestions } = mentionPlugin;

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      editorState: EditorState.createEmpty(),
      suggestions: user
    };

    // const content = window.localStorage.getItem("content");

    // if (content) {
    //   this.state.editorState = EditorState.createWithContent(
    //     convertFromRaw(JSON.parse(content))
    //   );
    // } else {
    //   this.state.editorState = EditorState.createEmpty();
    // }
  }

  componentDidMount() {
    fetch("https://5bf270bda60fe600134cdf37.mockapi.io/baseMessages")
      .then(res => res.json())
      .then(response => console.log("Success:", JSON.stringify(response)))
      .catch(error => console.error("Error:", error));
  }

  onSearchChange = ({ value }) => {
    this.setState({
      suggestions: defaultSuggestionsFilter(value, user)
    });
  };

  onChange = editorState => {
    console.log("change");
    console.log(convertToRaw(editorState.getCurrentContent()));
    this.setState({ editorState });
  };

  saveContent = content => {
    // window.localStorage.setItem(
    //   "content",
    //   JSON.stringify(convertToRaw(content))
    // );
    console.log({ ...convertToRaw(content) });
    let data = {
      id: "8172hinedw98suikjd",
      userId: "skdjbcsk9890o-ihbdkc",
      post: { ...convertToRaw(content) }
    };

    fetch("https://5bf270bda60fe600134cdf37.mockapi.io/baseMessages", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => res.json())
      .then(response => console.log("Success:", JSON.stringify(response)))
      .catch(error => console.error("Error:", error));
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

  onKeyUp = event => {
    console.log(event.keyCode);
    if (event.key === "Enter") {
      this.saveContent(this.state.editorState.getCurrentContent());
      this.setState({ editorState: createEditorStateWithText(" ") });
    }
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
    const { editorState } = this.state;
    return (
      <div>
        {/* <button onClick={this.onUnderlineClick}>Underline</button>
        <button onClick={this.onlineThroughClick}>Strike Through</button>
        <button onClick={this.onToggleCode}>Code Block</button> */}
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
          onKeyUp={this.onKeyUp}
        >
          <Editor
            editorState={editorState}
            handleKeyCommand={this.handleKeyCommand}
            onChange={this.onChange}
            customStyleMap={styleMap}
            placeholder="Tell a story..."
            plugins={[
              emojiPlugin,
              hashtagPlugin,
              mentionPlugin,
              inlineToolbarPlugin
            ]}
            ref={element => {
              this.editor = element;
            }}
          />
          <EmojiSuggestions />
          <MentionSuggestions
            onSearchChange={this.onSearchChange}
            suggestions={this.state.suggestions}
          />
          <InlineToolbar>
            {// may be use React.Fragment instead of div to improve perfomance after React 16
            externalProps => (
              <React.Fragment>
                <BoldButton {...externalProps} />
                <ItalicButton {...externalProps} />
                <UnderlineButton {...externalProps} />
                <CodeButton {...externalProps} />
                <Separator {...externalProps} />
                <HeadlinesButton {...externalProps} />
                <UnorderedListButton {...externalProps} />
                <OrderedListButton {...externalProps} />
                <BlockquoteButton {...externalProps} />
                <CodeBlockButton {...externalProps} />
              </React.Fragment>
            )}
          </InlineToolbar>
        </div>
      </div>
    );
  }
}

export default App;
