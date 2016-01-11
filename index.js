import thunkMiddleware from 'redux-thunk'
import createLogger from 'redux-logger'
import { createStore, applyMiddleware } from 'redux'
import { selectReddit, fetchPosts } from './actions'
import rootReducer from './reducers'

const loggerMiddleware = createLogger()

const createStoreWithMiddleware = applyMiddleware(
  thunkMiddleware, // 讓我們來 dispatch() functions
  loggerMiddleware // 巧妙的 middleware，用來 logs actions
)(createStore)

const store = createStoreWithMiddleware(rootReducer)

store.dispatch(selectReddit('reactjs'))
store.dispatch(fetchPosts('reactjs')).then(() =>
  console.log(store.getState())
)