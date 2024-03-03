import reducer from '../reducers'
import promise from "redux-promise"

import { createStore, compose, applyMiddleware } from "redux"

let configureStore = function(){
	const _createStore = compose(applyMiddleware(promise))(createStore)
	const store = _createStore(reducer)

	return store
}

export default configureStore