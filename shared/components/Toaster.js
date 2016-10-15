import React        from 'react/lib/React';
import ReactDOM  	from 'react-dom';
import asyncToasterInstance from '../instances/AsyncToasterInstance';
export default class Toaster extends React.Component {
    constructor() {
        super();
        this.hideTimeout = 0;
        this.hideBound = this.hide.bind(this);
    }
    
    show(message) {
        if (typeof window.AsyncToasterInstance_ !== 'undefined') {
            ReactDOM.findDOMNode(this.refs.toaster).classList.add('toast-view--visible');
        } else {
            asyncToasterInstance().then(load => {
                load.loadCSS('./styles/toaster.css').then(() => {
                    ReactDOM.findDOMNode(this.refs.toaster).classList.add('toast-view--visible');
                });
            });
        }
        ReactDOM.findDOMNode(this.refs.toaster).textContent = message;
        clearTimeout(this.hideTimeout);
        this.hideTimeout = setTimeout(this.hideBound, 2000);
    }

    hide () {
        ReactDOM.findDOMNode(this.refs.toaster).classList.remove('toast-view--visible');
    }

    render() {
        return (
            <div>
                <aside ref="toaster" className="toast-view"></aside>
            </div>
        )
    }
}