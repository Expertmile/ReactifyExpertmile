import React                  from 'react/lib/React';
import ReactDOM  	          from 'react-dom';
import asyncHomeInstance    from '../../instances/AsyncAddHomeInstance';

export default class AddToHome extends React.Component {

    show() {
        if (typeof window.AsyncHomeInstance_ !== 'undefined') {
            ReactDOM.findDOMNode(this).classList.remove('hidden');
            ReactDOM.findDOMNode(this).classList.add('dialog-view__home--visible');
            
        } else {
            asyncHomeInstance().then(load => {
                load.loadCSS('./styles/addhome.css').then(() => {
                    ReactDOM.findDOMNode(this).classList.remove('hidden');
                    ReactDOM.findDOMNode(this).classList.add('dialog-view__home--visible');
                });
            });
        }
        return new Promise(() => {

            var removeEventListenersAndHide = () => {
                ReactDOM.findDOMNode(this.refs.okay).removeEventListener('click', onOkay);
                ReactDOM.findDOMNode(this).classList.add('hidden');
                ReactDOM.findDOMNode(this).classList.remove('dialog-view__home--visible');
            }

            var onOkay = () => {
                removeEventListenersAndHide();
            }

            ReactDOM.findDOMNode(this.refs.okay).addEventListener('click', onOkay);

        });
    }

    render() {
        return (
            <aside className="dialog-view__home js-dialog hidden">
                <div className="dialog-view__home__panel">
                 <img className="imageHome" src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODEiIGhlaWdodD0iOTEiIHZpZXdCb3g9IjAgMCA4MSA5MSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZT0iI2ZmZiIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48cGF0aCBkPSJtNzkuNDIgMTIuODMybC02LjU1OC0xMC45MS05LjI0MiA4LjY5IiBzdHJva2Utd2lkdGg9IjEuNyIvPjxwYXRoIGQ9Im03Mi41IDRzLTQuMzYgNzEuOTAyLTcxIDg2IiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz48L2c+PC9zdmc+" />
                    
                    <h4>Add Expertmile to Homescreen</h4>
                    <p>Tap  <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNCIgaGVpZ2h0PSIxNyIgdmlld0JveD0iMCAwIDQgMTciIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48cGF0aCBzdHJva2U9IiNlYWVhZWEiIGQ9Ik04LjAzMyAyMC44NkgtNFYtMy4zNjRIOC4wMzNWMjAuODZ6Ii8+PHBhdGggZD0ibTIuMDIgNC43MWMxLjEwMyAwIDIuMDEtLjkwOCAyLjAxLTIuMDIgMC0xLjExLS45MDItMi4wMi0yLTIuMDItMS4xMDMuMDAxLTIuMDEuOTExLTIuMDEgMi4wMiAwIDEuMTEuOTA0IDIuMDIgMi4wMSAyLjAyem0wIDIuMDJjLTEuMTAzIDAtMi4wMS45MDYtMi4wMSAyLjAyIDAgMS4xMS45MDQgMi4wMiAyLjAxIDIuMDIgMS4xMDMgMCAyLjAxLS45MDggMi4wMS0yLjAyIDAtMS4xMS0uOTAyLTIuMDItMi0yLjAyem0wIDYuMDVjLTEuMTAzIDAtMi4wMS45MDgtMi4wMSAyLjAyIDAgMS4xMS45MDQgMi4wMiAyLjAxIDIuMDIgMS4xMDMgMCAyLS45MDggMi0yLjAyIDAtMS4xMS0uOTAyLTIuMDItMi0yLjAyIiBmaWxsPSIjZmZmIi8+PC9nPjwvc3ZnPg==" /> icon to bring up your browser menu and select 'Add to Homescreen' to pin Expertmile web app.</p>
                    <button ref="okay"> Got it</button>
                </div>
            </aside>
        )
    }
} 