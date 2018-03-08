// @flow
const ROOT_PATH = process.env.NODE_ENV === 'production'
  ? '/'
  : 'http://localhost:4321/'

export const RESET = 'RESET'
export const reset = (): Object => ({
  type: RESET,
})

export const PERSIST_SYNONYM = 'PERSIST_SYNONYM'
export const persist_synonym = (tags, synName) => {
  return {
    type: PERSIST_SYNONYM,
    payload: {
      tags: tags,
      synName: synName,
    }
  }
}

export const ADD_SYNONYM = "ADD_SYNONYM"
export const add_synonym = (newSyn) => {
  return {
    type: ADD_SYNONYM,
    payload : newSyn ,
  }
}

export const EDIT = 'EDIT'
export const edit = (id: string, value: Object): Object => ({
  type: EDIT,
  payload: { id, value }
})

export const DELETE_EXAMPLE = 'DELETE_EXAMPLE'
export const deleteExample = (id: string): Object => ({
  type: DELETE_EXAMPLE,
  payload: { id }
})
export const SET_SELECTION = 'SET_SELECTION'
export const setSelection = (
  id: string,
  start: number,
  end: number,
): Object => ({
  type: SET_SELECTION,
  payload: { id, start, end }
})

export const FETCH_DATA = 'FETCH_DATA'
export const fetchData = (
  path: string,
  data: Object,
): Object => ({
  type: FETCH_DATA,
  payload: { path, data }
})
export const loadData = () => async (dispatch: Function): Promise<void> => {
  const response: Object = await fetch(`${ROOT_PATH}data`, {
    method: 'POST',
  })
  const json = await response.json()
  dispatch(fetchData(json.path, json.data))
}

export const SAVING_DONE = 'SAVING_DONE'
export const save = (source: string): Function => async (
  dispatch: Function
): Promise<void> => {
  const response = await fetch(`${ROOT_PATH}save`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: source,
  })
  //TODO add progressing feedback
  const json = await response.json()
  if (json.ok) {
    dispatch({
      type: SAVING_DONE,
    })
  }
}

export const SAVING_DONE_SYNONYMS = 'SAVING_DONE_SYNONYMS'
export const save_synonym = (source: string): Function => async (
  dispatch: Function
): Promise<void> => {
  const response = await fetch(`${ROOT_PATH}save`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: source,
  })
  //TODO add progressing feedback
  const json = await response.json()
  if (json.ok) {
    dispatch({
      type: SAVING_DONE_SYNONYMS,
    })
  }
}

export const EXPAND = 'EXPAND'
export const expand = (id: string): Object => ({
  type: EXPAND,
  payload: { id }
})

export const COLLAPSE = 'COLLAPSE'
export const collapse = (id: string): Object => ({
  type: COLLAPSE,
  payload: { id }
})

export const OPEN_ADD_MODAL = 'OPEN_ADD_MODAL'
export const openAddModal = (): Object => ({
  type: OPEN_ADD_MODAL,
})

export const CLOSE_ADD_MODAL = 'CLOSE_ADD_MODAL'
export const closeAddModal = (): Object => ({
  type: CLOSE_ADD_MODAL,
})

export const SAVE_AND_CLOSE_ADD_MODAL = 'SAVE_AND_CLOSE_ADD_MODAL'
export const saveAndCloseAddModal = (): Object => ({
  type: SAVE_AND_CLOSE_ADD_MODAL,
})

export const GET_SYNONYMS = 'GET_SYNONYMS'
export const get_synonyms = (): Object => ({
  type: GET_SYNONYMS,
  synonyms: this.state.synonyms,
})
