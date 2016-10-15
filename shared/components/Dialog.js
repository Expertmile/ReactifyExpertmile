import React        from 'react/lib/React';
import ReactDOM  	from 'react-dom';

export default class Dialog extends React.Component {

    hide = () => {
        ReactDOM.findDOMNode(this).classList.remove('dialog-view--visible');
    } 

    show = (title, message, postID) => {
        ReactDOM.findDOMNode(this.refs.title).textContent = title;
        ReactDOM.findDOMNode(this.refs.message).textContent = message;
        ReactDOM.findDOMNode(this).classList.add('dialog-view--visible');

        return new Promise((resolve, reject) => {

            var removeEventListenersAndHide = () => {
                ReactDOM.findDOMNode(this.refs.cancel).removeEventListener('click', onCancel);
                ReactDOM.findDOMNode(this.refs.okay).removeEventListener('click', onOkay);
                ReactDOM.findDOMNode(this).classList.remove('dialog-view--visible');
            }

            var onCancel = () => {
                removeEventListenersAndHide();
                reject();
            }

            var onOkay = () => {
                removeEventListenersAndHide();
                resolve(postID);
            }

            ReactDOM.findDOMNode(this.refs.cancel).addEventListener('click', onCancel);
            ReactDOM.findDOMNode(this.refs.okay).addEventListener('click', onOkay);

        });
    }

    render() {
        return (
            <aside className="dialog-view js-dialog">
                <div className="dialog-view__panel">
                    <div className="dialog-view__panel-header">
                        <h1 ref="title" className="dialog-view__panel-title js-title"></h1>
                        <p  ref="message" className="dialog-view__panel-message js-message"></p>
                    </div>

                    <div className="dialog-view__panel-footer">
                        <button tabIndex="-1" ref="cancel" className="dialog-view__panel-button js-cancel">Cancel</button>
                        <button tabIndex="-1" ref="okay" className="dialog-view__panel-button js-okay">Okay</button>
                    </div>
                </div>
            </aside>
        )
    }
} 