// @flow

import React, { Component } from 'react'
import { Modal, Button, Icon, Collapse } from 'antd'
import { connect } from 'react-redux'
import * as actions from '../state/actions'
import ClearButton from './ClearButton'
import FileReaderInput from 'react-file-reader-input'
import { saveAs } from 'file-saver'
import generateExport from '../utils/generateExport'
import EditableTagGroup from './EditableTagGroup';

const mapState = (state) => ({
  filename: state.filename || 'loading...',
  isUnsaved: state.isUnsaved,
  examples: state.examples,
  synonyms: state.synonyms,
})
const Panel = Collapse.Panel;
const mapActions = dispatch => ({
  save_synonyms: (synonyms) => {
    dispatch(actions.save_synonym(synonyms))
  },
  save: (examples) => {
    dispatch(actions.save(examples))
  },
  openAddModal: () => {
    dispatch(actions.openAddModal())
  },
  fetchData: (path, data) => {
    dispatch(actions.fetchData(path, data))
  },
})

const styles = {
  button: {
    height: 28,
    marginTop: 2,
    marginRight: 8,
  },
  head:{
    weight: 'bold'
  }
}

class TopBar extends Component {
  state = {
    visible: false,
  }
  showModal = () => {
    this.setState({
      visible: true,
    });
  }
  handleCancel = (e) => {
    this.setState({
      visible: false,
    });
  }
  handleFileInputChange(_, results) {
    const [e, file] = results[0]
    let data
    try {
      data = JSON.parse(e.target.result)
    }
    catch (e) {
      return alert('Can\'t JSON parse the selected file :(')
    }
    data.rasa_nlu_data = data.rasa_nlu_data || {}
    data.rasa_nlu_data.common_examples = data.rasa_nlu_data.common_examples || []
    this.props.fetchData(file.name, data)
  }

  render() {
    const { filename, isUnsaved, save, openAddModal, synonyms } = this.props
    const fileButtons =
      <div style={{ display: 'flex' }}>
        <FileReaderInput
          as='text'
          onChange={(e, results) => this.handleFileInputChange(e, results)}
        >
          <Button type='ghost' style={styles.button}>
            <Icon type='upload' /> Click to Upload
          </Button>
        </FileReaderInput>
        <Button
          type={isUnsaved ? 'primary' : 'ghost'}
          style={styles.button}
          onClick={() => {
            var blob = new Blob(
              [generateExport()],
              { type: 'text/plain;charset=utf-8' },
            )
            //debugger
            saveAs(blob, filename)
          }}
        >
          <Icon type='download' /> Download
          </Button>
        <Button
          style={styles.button}
          type={isUnsaved ? 'primary' : 'default'}
          onClick={() => save(generateExport())}
        >
          Save
        </Button>
      </div>

    return (
      <div style={{ height: 32, display: 'flex' }}>
        <h3 style={{ marginLeft: 8, marginTop: 5 }}>
          {filename}
        </h3>
        <div style={{ flex: 1 }} />
        <div>
          <Button
            type="primary"
            onClick={this.showModal}
            style={styles.button}>
            Add/Remove Synonyms
          </Button>
          <Modal
            title="Add/Remove synonyms"
            bodyStyle={{height: '80%'}}
            visible={this.state.visible}
            onCancel={this.handleCancel}
            width='90%'
            cancelText="Close"
          >
          {
            synonyms.map((syn, i) => {
                return (
                  <div key={i}>
                    <mountNode>
                      <Collapse accordion>
                        <Panel style={styles.head} header={syn.value} key="1">
                          <EditableTagGroup synName={syn.value} synonyms={syn.synonyms} />
                        </Panel>
                      </Collapse>
                    </mountNode>
                  </div>
                )
              })
            }
          </Modal>
        </div>
        <Button
          style={styles.button}
          type='primary'
          onClick={() => openAddModal()}
        >
          Add new example
        </Button>
        {fileButtons}
        <ClearButton style={styles.button} />
      </div>
    )
  }
}

export default connect(mapState, mapActions)(TopBar)