import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Panel from '../../components/Panel';
import * as postActionCreators from '../../actions/posts';

const propTypes = {
  postActions: PropTypes.object.isRequired,
};

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componendDidMount() {
    const { postActions } = this.props;
    postActions.fetchPosts();
  }

  render() {
    return (
      <div className="posts">
        <Panel
          title="Profile"
        >
          <table>
            <tbody>
              <tr>
                <td>Name</td>
                <td>Abram</td>
              </tr>
            </tbody>
          </table>
        </Panel>
      </div>
    );
  }
}


function mapStateToProps(state) {
  const { posts } = state;
  return {
    posts,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    postActions: bindActionCreators(postActionCreators, dispatch),
  };
}

Profile.propTypes = propTypes;

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
