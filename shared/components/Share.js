import React        from 'react/lib/React';
import ReactDOM  	from 'react-dom';
import asyncDialogInstance    from '../instances/AsyncDialogInstance';

export default class Share extends React.Component {

    show(postID, status) {
        if (typeof window.AsyncDialogInstance_ !== 'undefined') {
            ReactDOM.findDOMNode(this).classList.add('dialog-view--visible');
        } else {
            asyncDialogInstance().then(load => {
                load.loadCSS('./styles/dialog.css').then(() => {
                    ReactDOM.findDOMNode(this).classList.add('dialog-view--visible');
                });
            });
        }

        ReactDOM.findDOMNode(this.refs.facebook).href = `https://www.facebook.com/sharer/sharer.php?u=https://expertmile.com/expert-advice.php?topic=${postID}`;
        ReactDOM.findDOMNode(this.refs.twitter).href = `https://twitter.com/intent/tweet?url=https://expertmile.com/expert-advice.php?topic=${postID}&text=${status}`;
        ReactDOM.findDOMNode(this.refs.gPlus).href = `https://plus.google.com/share?url=https://expertmile.com/expert-advice.php?topic=${postID}`;
        ReactDOM.findDOMNode(this.refs.linkedin).href = `https://www.linkedin.com/shareArticle?url=https://expertmile.com/expert-advice.php?topic=${postID}&summary=${status}&source=https://expertmile.com`;

        var removeEventListenersAndHide = () => {
            ReactDOM.findDOMNode(this.refs.panel).removeEventListener('click', onPanel);
            ReactDOM.findDOMNode(this).classList.remove('dialog-view--visible');
        }

        var onPanel = () => {
            removeEventListenersAndHide();
        }

        ReactDOM.findDOMNode(this.refs.panel).addEventListener('click', onPanel);
    }

    render() {
        return (
            <aside className="dialog-view js-dialog" ref="panel">
                <div className="dialog-view__panel">
                    <div className="dialog-view__panel-headermenu">
                        <div className="side-nav__body">
                            <button className="side-nav__main side-nav__facebook">
                                <div><a ref="facebook" target="_blank">Share on Facebook</a></div>
                            </button>
                            <button className="side-nav__main side-nav__twitter">
                                <div><a ref="twitter" target="_blank">Share on Twitter</a></div>
                            </button>
                            <button className="side-nav__main side-nav__gplus">
                                <div><a ref="gPlus" target="_blank">Share on Google Plus</a></div>
                            </button>
                            <button className="side-nav__main side-nav__linkedin">
                                <div><a ref="linkedin" target="_blank">Share on Linkedin</a></div>
                            </button>
                        </div>
                    </div>
                </div>
            </aside>
        )
    }
} 