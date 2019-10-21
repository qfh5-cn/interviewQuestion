import React,{Component} from 'react';
import { Tag, Input, Tooltip, Icon } from 'antd';

class MyTags extends Component {
  state = {
    tags:[],
    inputVisible: false,
    inputValue: '',
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
    let { inputValue,tags } = this.state;
    let { onChange } = this.props;
    if (inputValue && tags.indexOf(inputValue) === -1) {
      tags = [...tags, inputValue];
      onChange(tags);
    }

    this.setState({
      tags,
      inputVisible: false,
      inputValue: '',
    });

    
  };

  saveInputRef = input => (this.input = input);

  render() {
    let {disabled,value=[],onClick} = this.props;
    const { tags=value, inputVisible, inputValue } = this.state;
    return (
      <>
        {tags.map((tag, index) => {
          const isLongTag = tag.length > 20;
          const tagElem = (
            <Tag key={tag} onClose={() => this.handleClose(tag)} onClick={onClick&&onClick.bind(this,tag)}>
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
            onBlur={this.handleInputConfirm}
            onPressEnter={this.handleInputConfirm}
          />
        )}
        {!disabled && !inputVisible && (
          <Tag onClick={this.showInput} style={{ background: '#fff', borderStyle: 'dashed' }}>
            <Icon type="plus" /> New Tag
          </Tag>
        )}
      </>
    );
  }
}

export default MyTags;