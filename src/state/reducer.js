// @flow
import immutable from 'object-path-immutable'
import testData from './testData.json'
import pick from 'lodash/pick'

import {
  EDIT,
  DELETE_EXAMPLE,
  SET_SELECTION,
  FETCH_DATA,
  SAVING_DONE,
  EXPAND,
  COLLAPSE,
  OPEN_ADD_MODAL,
  CLOSE_ADD_MODAL,
  SAVE_AND_CLOSE_ADD_MODAL,
  RESET,
  PERSIST_SYNONYM,
  ADD_SYNONYM,
} from './actions'

let exampleIDCounter = 0
let synonymIDCounter = 0

function createExample({text='', intent='', entities=[]}) {
  return {
    text,
    intent,
    entities,
    updatedAt: Date.now(),
    isExpanded: false,
    id: (++exampleIDCounter).toString(),
  }
}

function createSynonym({value='', synonyms=[]}) {
  return {
    value,
    synonyms,
    updatedAt: Date.now(),
    isExpanded: false,
    id: (++synonymIDCounter).toString(),  
  }
}

function prepareExamples(examples = []) {
  return examples.map(example => createExample(example))
}

function prepareSynonyms(synonyms = []) {
  return synonyms.map(synonym => createSynonym(synonym))
}

const INITIAL_STATE = {
  filename: 'testData.json',
  originalSource: testData, 
  examples:testData.rasa_nlu_data.common_examples.map(e => createExample(e)),
  synonyms:testData.rasa_nlu_data.entity_synonyms.map(e => createSynonym(e)),
  isUnsaved: false,
  isUnsaved_synonyms: false,
  selection: null,
  idExampleInModal: null,
}

export default function reducer (
  state: Object = INITIAL_STATE,
  action: Object
): Object {
  const { type, payload } = action

  function getExampleIndex(_id: string) {
    return state.examples.findIndex(({id}) => id === _id)
  }
  switch (type) {
    case RESET: {
      return {
        ...state,
        examples: [],
        synonyms: [],
        isUnsaved: false,
        isUnsaved_synonyms: false,
        selection: null,
        idExampleInModal: null,
      }
    }
    case EDIT: {
      const { id, value } = payload
      const update = pick(value, ['text', 'intent', 'entities'])
      state = immutable.assign(
        state,
        `examples.${getExampleIndex(id)}`,
        { ...update, updatedAt: Date.now() },
      )
      return { ...state, isUnsaved: true }
    }
    case DELETE_EXAMPLE: {
      const { id } = payload
      state = immutable.del(
        state,
        `examples.${getExampleIndex(id)}`,
      )
      return { ...state, isUnsaved: true }
    }
    case SET_SELECTION: {
      const { id, start, end } = payload
      if (start === end) {
        return state
      }
      return immutable.set(state, `selection`, { idExample: id, start, end })
    }
    case FETCH_DATA: {
      const { data, path } = payload
      return {
        ...state,
        examples: prepareExamples(data.rasa_nlu_data.common_examples),
        synonyms: prepareSynonyms(data.rasa_nlu_data.entity_synonyms),
        originalSource: data,
        filename: path,
      }
    }
    case SAVING_DONE: {
      return {
        ...state,
        isUnsaved: false,
      }
    }
    case EXPAND: {
      const { id } = payload

      return immutable.set(
        state,
        `examples.${getExampleIndex(id)}.isExpanded`,
        true,
      )
    }
    case COLLAPSE: {
      const { id } = payload

      return immutable.set(
        state,
        `examples.${getExampleIndex(id)}.isExpanded`,
        false,
      )
    }
    case OPEN_ADD_MODAL: {
      const example = createExample({})
      state = immutable.push(
        state,
        `examples`,
        example,
      )
      return immutable.set(state, `idExampleInModal`, example.id)
    }
    case CLOSE_ADD_MODAL: {
      state = immutable.del(
        state,
        `examples.${getExampleIndex(state.idExampleInModal)}`,
      )
      return immutable.set(state, `idExampleInModal`, null)
    }
    case SAVE_AND_CLOSE_ADD_MODAL: {
      return immutable.set(state, `idExampleInModal`, null)
    }
    case PERSIST_SYNONYM: {
      let originalSource= state.originalSource
      originalSource.rasa_nlu_data.entity_synonyms.map((src) => {
        if(src.value === payload.synName)
          src.synonyms = payload.tags
      })
      state.originalSource = originalSource
      return state
    }
    case ADD_SYNONYM: {
      let originalSource= state.originalSource
      let synIsPresent = false
      originalSource.rasa_nlu_data.entity_synonyms.map((item) => {
        if(item.value === payload) synIsPresent=true
      })
      if(!synIsPresent){
        originalSource.rasa_nlu_data.entity_synonyms.push({
          value: payload,
          synonyms: [payload]
        })
        //console.log(originalSource.rasa_nlu_data.entity_synonyms);
      }
      state.originalSource = originalSource
      return {
        ...state,
        synonyms: prepareSynonyms(originalSource.rasa_nlu_data.entity_synonyms),
      }
    }
      default:
      return state
  }
}