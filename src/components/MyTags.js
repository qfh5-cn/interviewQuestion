import React, { Component } from "react";
import { Tag, Input, Tooltip, Icon, Divider } from "antd";
import Api from "@/api";

class MyTags extends Component {
  state = {
    tags: [],
    inputVisible: false,
    inputValue: "",
    tagList: [] // 热门tag
  };

  handleClose = removedTag => {
    const tags = this.state.tags.filter(tag => tag !== removedTag);
    this.setState({ tags });
  };

  showInput = () => {
    this.setState({ inputVisible: true }, () => this.input.focus());
  };

  handleInputChange = e => {
    this.setState({ inputValue: e.target.value });
  };

  handleInputConfirm = () => {
    let { inputValue, tags } = this.state;
    let { onChange } = this.props;
    if (inputValue && tags.indexOf(inputValue) === -1) {
      tags = [...tags, inputValue];
      onChange(tags);
    }

    this.setState({
      tags,
      inputVisible: false,
      inputValue: ""
    });
  };

  saveInputRef = input => (this.input = input);

  async componentDidMount() {
    // 获取所有tags
    let { data: tagList } = await Api.get("/iq/tags");
    tagList.sort((a, b) => b.value - a.value);
    this.setState({
      tagList
    });
  }

  render() {
    let { disabled, onClick } = this.props;
    let { tags, tagList, inputVisible, inputValue } = this.state;
    return (
      <>
        {tags.map(tag => {
          const isLongTag = tag.length > 20;
          const tagElem = (
            <Tag key={tag} closable onClose={() => this.handleClose(tag)}>
              {isLongTag ? `${tag.slice(0, 20)}...` : tag}
            </Tag>
          );
          return isLongTag ? (
            <Tooltip title={tag} key={tag}>
              {tagElem}
            </Tooltip>
          ) : (
            tagElem
          );
        })}
        {inputVisible && (
          <Input
            ref={this.saveInputRef}
            type="text"
            size="small"
            style={{ width: 78 }}
            value={inputValue}
            onChange={this.handleInputChange}
            // onBlur={this.handleInputConfirm}
            onPressEnter={this.handleInputConfirm}
          />
        )}
        {!disabled && !inputVisible && (
          <>
            <Tag
              onClick={this.showInput}
              style={{ background: "#fff", borderStyle: "dashed" }}
            >
              <Icon type="plus" /> New Tag
            </Tag>
            <Divider orientation="left" style={{ fontSize: "inherit" }} dashed>
              热门tag:
            </Divider>
            {tagList.map(tag => {
              let checked = tags.includes(tag.text);
              return (
                <Tag.CheckableTag
                  key={tag.text}
                  checked={checked}
                  onChange={() => {
                    if (checked) {
                      tags = tags.filter(item => item != tag.text);
                    } else {
                      tags.push(tag.text);
                    }
                    this.setState({ tags });
                  }}
                >
                  {tag.text}
                  {checked ? (
                    <Icon type="close" style={{ color: "#fff" }} />
                  ) : null}
                </Tag.CheckableTag>
              );
            })}
          </>
        )}
      </>
    );
  }
}

export default MyTags;
