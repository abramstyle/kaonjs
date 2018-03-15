import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './style.css';

const propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node,
};

class Panel extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const { title } = this.props;
    return (
      <div styleName="panel">
        <header styleName="header">
          <h1 styleName="title">{title}</h1>
        </header>
        <div className="content">
          {this.props.children}
        </div>
      </div>
    );
  }
}

Panel.propTypes = propTypes;

export default Panel;
