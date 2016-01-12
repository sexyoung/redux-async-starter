import React from 'react';
import { selectReddit, fetchPostsIfNeeded, invalidateReddit } from '../actions';
import Picker from '../components/Picker'
import { connect } from 'react-redux'

class AsyncApp extends React.Component {
  constructor(props){
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(nextReddit){
    this.props.dispatch(selectReddit(nextReddit))
  }

  render() {
    const { selectedReddit, posts, isFetching, lastUpdated } = this.props
    return (
      <div>
        <Picker value={selectedReddit}
                onChange={this.handleChange}
                options={[ 'reactjs', 'frontend' ]} />
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { selectedReddit, postsByReddit } = state
  const {
    isFetching,
    lastUpdated,
    items: posts
  } = postsByReddit[selectedReddit] || {
    isFetching: true,
    items: []
  }

  return {
    selectedReddit,
    posts,
    isFetching,
    lastUpdated
  }
}

export default connect(mapStateToProps)(AsyncApp);