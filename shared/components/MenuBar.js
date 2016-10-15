import React                  from 'react/lib/React';
import ReactDOM  	          from 'react-dom';
import asyncDialogInstance    from '../instances/AsyncDialogInstance';

export default class DialogWindow extends React.Component {

    show(postID) {
        if (typeof window.AsyncDialogInstance_ !== 'undefined') {
            ReactDOM.findDOMNode(this).classList.add('dialog-view--visible');
        } else {
            asyncDialogInstance().then(load => {
                load.loadCSS('/timeline/styles/dialog.css').then(() => {
                    ReactDOM.findDOMNode(this).classList.add('dialog-view--visible');
                });
            });
        }
        return new Promise((resolve) => {

            var removeEventListenersAndHide = () => {
                ReactDOM.findDOMNode(this.refs.delete).removeEventListener('click', onDelete);
                ReactDOM.findDOMNode(this.refs.edit).removeEventListener('click', onEdit);
                ReactDOM.findDOMNode(this.refs.panel).removeEventListener('click', onPanel);
                ReactDOM.findDOMNode(this).classList.remove('dialog-view--visible');
            }

            var onDelete = () => {
                removeEventListenersAndHide();
                const data = {'button': 'delete','postID': postID }
                resolve(data);
            }

            var onEdit = () => {
                removeEventListenersAndHide();
                const data = {'button': 'edit','postID': postID }
                resolve(data);
            }

            var onPanel = () => {
                removeEventListenersAndHide();
            }

            ReactDOM.findDOMNode(this.refs.delete).addEventListener('click', onDelete);
            ReactDOM.findDOMNode(this.refs.edit).addEventListener('click', onEdit);
            ReactDOM.findDOMNode(this.refs.panel).addEventListener('click', onPanel);

        });
    }

    render() {
        return (
            <aside className="dialog-view js-dialog" ref="panel">
                <div className="dialog-view__panel">
                    <div className="dialog-view__panel-headermenu">
                        <div className="side-nav__body">
                            <button ref="edit" className="side-nav__main side-nav__edit_status">
                                <div><b>Edit this update</b></div>
                                <span className="detailed_item">Make changes to your update.</span>
                            </button>
                            <button ref="delete" className="side-nav__main side-nav__delete_status">
                                <div><b>Delete this update</b></div>
                                <span className="detailed_item">Remove this update from timeline.</span>
                            </button>
                        </div>
                    </div>
                </div>
            </aside>
        )
    }
} 