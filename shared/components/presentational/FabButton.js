import React from 'react/lib/React';

export default class FabButton extends React.Component {
    render() {
        return (
            <button onClick={this.props.handleClick} className="new-recording-btn js-new-recording-btn">
                New Post
            </button>
        )
    }
}
