import App from './App'
import React from 'react'
import ReactDOM from 'react-dom/client'
import configureStore from './store/index'
import reportWebVitals from './reportWebVitals'
import AuthProvider from 'react-auth-kit/AuthProvider'

import { auth } from './store/auth'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'

import './index.css'

const root = ReactDOM.createRoot(document.getElementById('root'))
export const store = configureStore()

root.render(
    <AuthProvider store={auth}>
        <BrowserRouter>
            <Provider store={store}>	
                <App />
            </Provider>
        </BrowserRouter>
    </AuthProvider>
)

reportWebVitals()