import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/App'
import { Provider } from 'react-redux'
import enUS from 'antd/lib/locale-provider/en_US'
import { LocaleProvider } from 'antd'
import * as actions from './state/actions'
import './index.css'
import registerServiceWorker from './registerServiceWorker';
import store from './state/store';
import 'antd/dist/antd.css'; 


store.dispatch(actions.loadData())
global.store = store //DEBUG

ReactDOM.render(
  <Provider store={store}>
    <LocaleProvider locale={enUS}>
      <App />
    </LocaleProvider>
  </Provider>,
  document.getElementById('root')
)
registerServiceWorker();
