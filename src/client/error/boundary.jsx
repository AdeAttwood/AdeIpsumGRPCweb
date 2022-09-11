import React from "react";
import PropTypes from "prop-types";

export class Boundary extends React.Component {
  static propTypes = {
    children: PropTypes.node,
  };

  state = {
    /**
     * @type {Boolean}
     */
    hasError: false,
    /**
     * @type {Error | undefined}
     */
    error: undefined,
  };

  componentDidCatch(error) {
    this.setState({ hasError: true, error });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="alert alert-danger text-center" role="alert">
          {this.state.error.message}
        </div>
      );
    }

    return this.props.children;
  }
}

export default Boundary;
