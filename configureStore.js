import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import createLogger from 'redux-logger'
import rootReducer from './reducers'

const loggerMiddleware = createLogger()

const createStoreWithMiddleware = applyMiddleware(
  thunkMiddleware, // 讓我們來 dispatch() functions
  loggerMiddleware // 巧妙的 middleware，用來 logs actions
)(createStore)

export default function configureStore(initialState) {
  return createStoreWithMiddleware(rootReducer, initialState)
}