import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as serviceActionCreators from '../../actions/services';

const propTypes = {
  services: PropTypes.object,
  serviceActions: PropTypes.object,
};

class Services extends Component {
  componentDidMount() {
    const { serviceActions } = this.props;

    serviceActions.fetchServices();
  }

  render() {
    const { services } = this.props;
    const loadingState = services.get('loadingState');
    // const error = services.get('error');

    return (
      <div className="services">
        <h1>Services</h1>
        <div>status: {loadingState}</div>
      </div>
    );
  }
}

Services.propTypes = propTypes;

function mapStateToProps(state) {
  const { services } = state;
  return {
    services,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    serviceActions: bindActionCreators(serviceActionCreators, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Services);
