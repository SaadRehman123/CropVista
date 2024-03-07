import App from './App'
import React from 'react'
import ReactDOM from 'react-dom/client'
import configureStore from './store/index'
import reportWebVitals from './reportWebVitals'

import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'

import './index.css'

const root = ReactDOM.createRoot(document.getElementById('root'))
export const store = configureStore()

root.render(
  <BrowserRouter>
    <Provider store={store}>	
      <App />
    </Provider>
  </BrowserRouter>
)

reportWebVitals()