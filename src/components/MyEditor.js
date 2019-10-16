import React, { Component } from "react";
import { Editor, EditorState, RichUtils } from "draft-js";
import { Button, Select, Tooltip } from "antd";
import "./MyEditor.scss";

class MyEditor extends Component {
  state = {
    editorState: EditorState.createEmpty(),
    TITLE_TYPES: [
      { label: "H1", style: "header-one" },
      { label: "H2", style: "header-two" },
      { label: "H3", style: "header-three" },
      { label: "H4", style: "header-four" },
      { label: "H5", style: "header-five" },
      { label: "H6", style: "header-six" }
    ],
    LIST_TYPES: [
      { label: "UL", style: "unordered-list-item", icon: "unordered-list" },
      { label: "OL", style: "ordered-list-item", icon: "ordered-list" }
    ],
    BLOCK_TYPES: [
      { label: "Blockquote", style: "blockquote", icon: "tag" },
      { label: "Code Block", style: "code-block", icon: "code" }
    ],
    INLINE_STYLES: [
      { label: "Bold", style: "BOLD", icon: "bold" },
      { label: "Italic", style: "ITALIC", icon: "italic" },
      { label: "Underline", style: "UNDERLINE", icon: "underline" },
      { label: "Monospace", style: "CODE", icon: "bg-colors"  }
    ]
  };

  onChange = editorState => {
    this.setState({ editorState });
    console.log(editorState.covertToRaw())
  };
  setEditor = editor => {
    this.editor = editor;
  };
  focusEditor = () => {
    if (this.editor) {
      this.editor.focus();
    }
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

  componentDidMount() {
    this.focusEditor();
  }

  _toggleBlockType(blockType) {
    this.onChange(RichUtils.toggleBlockType(this.state.editorState, blockType));
    // this.focusEditor();
  }
  _toggleInlineStyle(inlineStyle) {
    this.onChange(
      RichUtils.toggleInlineStyle(this.state.editorState, inlineStyle)
    );
    // this.focusEditor();
  }

  render() {
    let {
      INLINE_STYLES,
      BLOCK_TYPES,
      LIST_TYPES,
      TITLE_TYPES,
      editorState
    } = this.state;

    const selection = editorState.getSelection();
    const blockType = editorState
        .getCurrentContent()
        .getBlockForKey(selection.getStartKey())
        .getType();

    var currentStyle = editorState.getCurrentInlineStyle();
    return (
      <div className="lx-editor">
        <div className="utils">
          <Select
            defaultValue="H1"
            style={{ width: 120 }}
            size="small"
            onChange={this._toggleBlockType}
          >
            {TITLE_TYPES.map((item, idx) => (
              <Select.Option
                key={item.style}
                value={item.style}
                style={{ fontSize: 24 - idx * 1.8 }}
              >
                {item.label}
              </Select.Option>
            ))}
          </Select>
          <Button.Group size="small">
            {INLINE_STYLES.map(item => (
              <Tooltip title={item.label} key={item.style}>
                <Button
                  icon={item.icon}
                  style={
                    currentStyle.has(item.style)
                      ? styles.activeButton
                      : null
                  }
                  onClick={this._toggleInlineStyle.bind(this, item.style)}
                >
                  {!item.icon ? item.label : null}
                </Button>
              </Tooltip>
            ))}
          </Button.Group>
          <Button.Group size="small">
            {LIST_TYPES.map(item => (
              <Tooltip title={item.label} key={item.style}>
                <Button
                  icon={item.icon}
                  onClick={this._toggleBlockType.bind(this, item.style)}
                  style={
                    item.style===blockType
                      ? styles.activeButton
                      : null
                  }
                >
                  {!item.icon ? item.label : null}
                </Button>
              </Tooltip>
            ))}
          </Button.Group>
          <Button.Group size="small">
            {BLOCK_TYPES.map(item => (
              <Tooltip title={item.label} key={item.style}>
                <Button
                  icon={item.icon}
                  onClick={this._toggleBlockType.bind(this, item.style)}
                  style={
                    item.style===blockType
                      ? styles.activeButton
                      : null
                  }
                >
                  {!item.icon ? item.label : null}
                </Button>
              </Tooltip>
            ))}
          </Button.Group>
        </div>
        <Editor
          style={styles.editor}
          ref={this.setEditor}
          editorState={editorState}
          onChange={this.onChange}
          handleKeyCommand={this.handleKeyCommand}
          onClick={this.focusEditor}
        />
      </div>
    );
  }
}

const styles = {
  editor: {
    minHeight: "16em"
  },
  activeButton:{ borderColor: "#40a9ff", color: "#40a9ff" }
};
export default MyEditor;
