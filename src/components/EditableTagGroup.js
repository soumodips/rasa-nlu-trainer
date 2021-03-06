import React from "react";
import { Tag, Input, Tooltip, Icon, Modal} from "antd";
import { connect } from 'react-redux'
import * as actions from '../state/actions'
import { persist_synonym } from '../state/actions';
import { bindActionCreators } from "redux";


const ERROR_TITLE = 'Oops! Error adding synonym'
const ERROR_CONTENT = 'Looks like the synonym you added is already present for this or another value.'
const mapActions = dispatch => ({
  save: () => {
    dispatch(actions.save_synonym())
  },
})

function matchDispatchToProps(dispatch){
  return bindActionCreators({persist_synonym: persist_synonym}, dispatch)
}
class EditableTagGroup extends React.Component {
  
  state = {
    synName: this.props.synName,
    allSynonyms: this.props.allSynonyms,
    tags: this.props.synonyms,
    inputVisible: false,
    inputValue: ""
  };

  handleClose = removedTag => {
    const tags = this.state.tags.filter(tag => tag !== removedTag);
    this.setState({ tags });
    this.props.persist_synonym(tags, this.state.synName)
  };

  showInput = () => {
    this.setState({ inputVisible: true }, () => this.input.focus());
  };

  handleInputChange = e => {
    this.setState({ inputValue: e.target.value });
  };

  isPresentForOtherVals = (val) => {
    let isPresent = false
    const allSynonyms = this.state.allSynonyms
    allSynonyms.map((item) => {
      if(!(isPresent) === true) isPresent = item.synonyms.find(k => k===val)
    })
    if(isPresent === undefined) isPresent = false
    return isPresent
  };

  handleInputConfirm = () => {
    const state = this.state;
    const inputValue = state.inputValue.toUpperCase();
    let tags = state.tags;
    let synName = state.synName;
    if (inputValue && tags.indexOf(inputValue) === -1 && !this.isPresentForOtherVals(inputValue))
      tags = [...tags, inputValue];
    else{
      Modal.error({
          title: ERROR_TITLE,
          content: ERROR_CONTENT
        })
      }
    
    this.setState({
      tags,
      inputVisible: false,
      inputValue: ""
    });
    this.props.persist_synonym(tags, synName)
  };

  saveInputRef = input => (this.input = input);

  render() {
    const { tags, inputVisible, inputValue } = this.state;
    return (
      <div>
        {tags.map((tag, index) => {
          const isLongTag = tag.length > 20;
          const tagElem = (
            <Tag
              key={tag}
              closable={index !== 0}
              afterClose={() => this.handleClose(tag)}
            >
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
            onPressEnter={this.handleInputConfirm}
          />
        )}
        {!inputVisible && (
          <Tag
            onClick={this.showInput}
            style={{ background: "#fff", borderStyle: "dashed" }}
          >
            <Icon type="plus" /> New Synonym
          </Tag>
        )}
      </div>
    );
  }
}

export default connect(mapActions, matchDispatchToProps)(EditableTagGroup)