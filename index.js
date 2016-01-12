import thunkMiddleware from 'redux-thunk'
import createLogger from 'redux-logger'
import { createStore, applyMiddleware } from 'redux'
import { selectReddit, fetchPosts, delay } from './actions'
import rootReducer from './reducers'

const loggerMiddleware = createLogger()

/**
 * 用 { meta: { delay: N } } 來排程 actions 讓它延遲 N 毫秒。
 * 在這個案例中，讓 `dispatch` 回傳一個 function 來取消 timeout。
 */
const timeoutScheduler = store => next => action => {
  if (!action.meta || !action.meta.delay) {
    return next(action)
  }

  let timeoutId = setTimeout(
    () => next(action),
    action.meta.delay
  )

  return function cancel() {
    clearTimeout(timeoutId)
  }
}

/**
 * 在 actions 被 dispatched 之後，Logs 所有的 actions 和 states。
 */
const logger = store => next => action => {
  console.group(action.type)
  console.info('dispatching', action)
  let result = next(action)
  console.log('next state', store.getState())
  console.groupEnd(action.type)
  return result
}


const createStoreWithMiddleware = applyMiddleware(
  timeoutScheduler,
  logger,
  thunkMiddleware, // 讓我們來 dispatch() functions
  // loggerMiddleware // 巧妙的 middleware，用來 logs actions
)(createStore)

const store = createStoreWithMiddleware(rootReducer)

store.dispatch(selectReddit('reactjs', 2000))
// store.dispatch(fetchPosts('reactjs')).then(() =>
//   console.log(store.getState())
// )