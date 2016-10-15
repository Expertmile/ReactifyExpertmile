import React, { Component, PropTypes } from 'react';
import hoistStatics                    from 'hoist-non-react-statics';

const { shape, func, object } = PropTypes;
let initialRender = true;

export function rendered() {
  initialRender = false;
}

export default (fetch) => WrappedComponent => {
  class FetchDataDecorator extends Component {
    static WrappedComponent = WrappedComponent;
    static fetchData = fetch;

    static propTypes = {
      params: object,
    };

    static contextTypes = {
      store: shape({
        dispatch: func.isRequired,
        getState: func.isRequired,
      }),
    };

    componentDidMount() {
      if (initialRender) {
        return;
      }
      const { getState, dispatch } = this.context.store;

      fetch(getState(), dispatch, this.props.params);
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  }

  return hoistStatics(FetchDataDecorator, WrappedComponent);
};
