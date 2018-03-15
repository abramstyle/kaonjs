import { Component } from 'react';

class ErrorBountary extends Component {
  componentDidCatch(err, stack) {
    console.log('error: ', err);
    console.log('stack: ', stack);
  }
  render() {
    const { children } = this.props;
    return children;
  }
}

export default ErrorBountary;
