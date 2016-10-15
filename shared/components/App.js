import React, { PropTypes }   from 'react/lib/React';
import { rendered }         from '../lib/fetchDataDeferred';

export default class App extends React.Component {

  static propTypes = {
    children: PropTypes.object 
  };

  componentDidMount() {
    rendered();
  }

  render() {
    return (
      <div>
        {this.props.children}
      </div>
    );
  }
}
