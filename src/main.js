import React from 'react'
import {render} from 'react-dom'
import {HashRouter,BrowserRouter} from 'react-router-dom'
import {Provider} from 'react-redux';

import App from './App'
import store from './store'

let Router = process.env.NODE_ENV === 'production' ? BrowserRouter : HashRouter
render(
    <Provider store={store}>
        <Router>
            <App/>
        </Router>
    </Provider>,
    document.querySelector('#app')
)