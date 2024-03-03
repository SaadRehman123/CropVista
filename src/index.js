import App from './App'
import React from 'react'
import ReactDOM from 'react-dom/client'
import configureStore from './store/index'
import reportWebVitals from './reportWebVitals'

import { Provider } from 'react-redux'

import './index.css'

const root = ReactDOM.createRoot(document.getElementById('root'))
const store =  configureStore()

root.render(
  <React.StrictMode>
    <Provider store={store}>	
      <App />
    </Provider>
  </React.StrictMode>
)

reportWebVitals()
