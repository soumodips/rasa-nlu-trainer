// @flow

import React, { Component } from 'react'
import ExampleTable from './ExampleTable'
import TopBar from './TopBar'
import AddExampleModal from './AddExampleModal'
import CompatibilityAlert from './CompatibilityAlert'
import { connect } from 'react-redux'
import { Spin } from 'antd'

const mapState = (state) =>{
  return ({
  examples: state.examples,
  synonyms: state.synonyms
})
}
class App extends Component {
  render() {
    const { examples, synonyms } = this.props
    if (!examples) {
      return (
        <Spin style={{ width: '100%', height: '100%' }}>
          <div />
        </Spin>
      )
    }
    if (!synonyms) {
      return (
        <Spin style={{ width: '100%', height: '100%' }}>
          <div />
        </Spin>
      )
    }
    const intents = []
    examples.forEach(({ intent }) => {
      if (intent && intents.indexOf(intent) === -1) {
        intents.push(intent)
      }
    })

    const entityNames = []
    examples.forEach((example) => {
      example.entities.forEach(({ entity }) => {
        if (entity && entityNames.indexOf(entity) === -1) {
          entityNames.push(entity)
        }
      })
    })
    
    const entityValues = []
    examples.map(function (example) {
      if (example !== undefined && example.entities.length > 0)
        example.entities.map(function (item) {
          if (!entityValues[item.entity]) {
            entityValues[item.entity] = [item.value]
          } else {
            if (entityValues[item.entity].indexOf(item.value) === -1)
              entityValues[item.entity].push(item.value)
          }
        })
    })

    return (
      <div>
        <ExampleTable
          intents={intents}
          entityNames={entityNames}
          entityValues={entityValues}
          header={() => <TopBar synonyms={synonyms}/>}
        />
        <AddExampleModal
          intents={intents}
          entityNames={entityNames}
          entityValues={entityValues}
        />
        <CompatibilityAlert />
      </div>
    )
  }
}

export default connect(mapState)(App)