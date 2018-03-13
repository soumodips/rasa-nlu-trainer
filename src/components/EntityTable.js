// @flow

import React, { Component } from 'react';
import { Table, Button, Icon, AutoComplete } from 'antd'
import { connect } from 'react-redux'
import * as actions from '../state/actions'
import immutable from 'object-path-immutable'

const mapState = (state, props) => {
  const { example } = props
  const selection = state.selection && state.selection.idExample === example.id
    ? state.selection
    : null
  return {
    example,
    selection,
  }
}
const mapActions = dispatch => ({
  edit: (idExample, update) => {
    dispatch(actions.edit(idExample, update))
  },
})

class EntityTable extends Component {
  state = {
    'entityValuesDataSource': []
  }
  handleChange(entityIndex, key, value) {
    const { example, edit } = this.props
    edit(example.id, immutable.set(example, `entities.${entityIndex}.${key}`, value))
  }
  updateEntityValues(value, entityValues) {
    this.setState({
      entityValuesDataSource: entityValues[value]
    })
  }
  renderAddButton() {
    const { edit, example, selection } = this.props
    const selectionText = selection
      ? example.text.substr(selection.start, selection.end - selection.start)
      : null

    return selectionText
      ? (
        <Button
          type='primary'
          onClick={() => {
            edit(
              example.id,
              immutable.push(example, `entities`, {
                entity: '',
                value: '',
                start: selection.start,
                end: selection.end
              }))
          }}
        >
          {`add an entity for "${selectionText}"`}
        </Button>
      )
      : (
        <Button disabled={true}>
          'select some part of the text to create a new entity'
        </Button>
      )
  }
  render() {
    const { example, edit, entityNames, entityValues, entityValCallback } = this.props
    const entities = example.entities || []
    const columns = [
      {
        title: 'Entity',
        dataIndex: 'entity',
        key: 'entity',
        render: (_, entity) => (
          <AutoComplete
            style={{ width: 200 }}
            dataSource={entityNames}
            value={entity.entity}
            onChange={(value) => {
              this.handleChange(
                entity.index,
                'entity',
                value,
              )
              this.updateEntityValues(value, entityValues)
            }}
            placeholder='entity'
          />
        ),
      }, {
        title: 'Value',
        dataIndex: 'value',
        key: 'value',
        render: (_, entity) => (
          <AutoComplete
            dataSource={this.state.entityValuesDataSource}
            value={entity.value}
            onBlur={value => 
              {
                 if(entityValCallback instanceof Function )
                 return entityValCallback(value.toUpperCase())
              }}
            onChange={(value) => {
              this.handleChange(
                entity.index,
                'value',
                value,
              )
            }}
            placeholder='value'
          />
        ),
      }, {
        title: 'Selection',
        key: 'selection',
        render: (_, entity) => (
          <span>
            {example.text.substr(entity.start, entity.end - entity.start)}
          </span>
        ),
      }, {
        title: '',
        key: 'actions',
        render: (_, entity) => (
          <span>
            <Icon type='delete' onClick={() => {
              edit(example.id, immutable.del(example, `entities.${entity.index}`))
            }} />
          </span>
        ),
      },
    ]

    return (
      <div style={{ marginBottom: 5 }}>
        <Table
          style={{ marginBottom: 8 }}
          size='small'
          pagination={false}
          columns={columns}
          dataSource={entities.map((entity, index) => ({
            ...entity,
            index,
          }))}
          rowKey='index'
        />
        {this.renderAddButton()}
      </div>
    );
  }
}

export default connect(mapState, mapActions)(EntityTable)
