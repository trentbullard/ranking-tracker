import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null, errorInfo: null };
  }

  componentDidCatch(error, errorInfo) {
    console.log(`An error occured:`, error.stack);
    this.setState({
      error,
      errorInfo,
    });
  }

  render() {
    if (this.state.errorInfo) {
      return <div>something went wrong</div>;
    } else {
      return this.props.children;
    }
  }
}

export default ErrorBoundary;
