import "babel-polyfill";
import fetch from 'isomorphic-fetch'

export const SELECT_REDDIT = 'SELECT_REDDIT';
export const INVALIDATE_REDDIT = 'INVALIDATE_REDDIT';
export const REQUEST_POSTS = 'REQUEST_POSTS';
export const RECEIVE_POSTS = 'RECEIVE_POSTS';


export function selectReddit(reddit){
  return {
    type: SELECT_REDDIT,
    reddit
  }
}

export function invalidateReddit(reddit) {
  return {
    type: INVALIDATE_REDDIT,
    reddit
  }
}

function requestPosts(reddit) {
  return {
    type: REQUEST_POSTS,
    reddit
  }
}

function receivePosts(reddit, json) {
  return {
    type: RECEIVE_POSTS,
    reddit,
    posts: json.data.children.map(child => child.data),
    receivedAt: Date.now()
  }
}

function fetchPosts(reddit) {

  // Thunk middleware 知道如何去處理 functions。
  // 它把 dispatch method 作為參數傳遞給 function，
  // 因此讓它可以自己 dispatch actions。

  return dispatch => {

    // 第一個 dispatch：更新應用程式 state 以告知
    // API 呼叫開始了。

    dispatch(requestPosts(reddit))

    // 被 thunk middleware 呼叫的 function 可以回傳一個值，
    // 那會被傳遞作為 dispatch method 的回傳值。

    // 在這個案例中，我們回傳一個 promise 以等待。
    // 這不是 thunk middleware 所必須的，不過這樣對我們來說很方便。
    return fetch(`http://www.reddit.com/r/${reddit}.json`)
      .then(response => response.json())
      .then(json =>

        // 我們可以 dispatch 許多次！
        // 在這裡，我們用 API 呼叫的結果來更新應用程式的 state。

        dispatch(receivePosts(reddit, json))
      )

      // 在一個真實世界中的應用程式，你也會想要
      // 捕捉任何網路呼叫中的錯誤。
  }
}

function shouldFetchPosts(state, reddit) {
  const posts = state.postsByReddit[reddit]
  if (!posts) {
    return true
  } else if (posts.isFetching) {
    return false
  } else {
    return posts.didInvalidate
  }
}

export function fetchPostsIfNeeded(reddit) {
  return (dispatch, getState) => {
    if (shouldFetchPosts(getState(), reddit)) {
      return dispatch(fetchPosts(reddit))
    }
  }
}