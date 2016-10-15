import React from 'react/lib/React';
import ReactDOM from 'react-dom';
import asyncSideBarInstance from '../../instances/AsyncSideBarInstance';

export default class SideNav extends React.Component {
    constructor() {
        super();
        this.touchStartX = 0;
        this.sideNavTransform = 0;
    }

    onSideNavTouchStart = (e) => {
        this.touchStartX = e.touches[0].pageX;
    }
 
    onSideNavTouchMove = (e) => {
        var newTouchX = e.touches[0].pageX;
        this.sideNavTransform = Math.min(0, newTouchX - this.touchStartX);

        if (this.sideNavTransform < 0)
            e.preventDefault();

        ReactDOM.findDOMNode(this.refs.sideNavContent).style.transform =
        'translateX(' + this.sideNavTransform + 'px)';
    }

    onSideNavTouchEnd = () => {
        if (this.sideNavTransform < -1)
            this.closeSideNav();
    }

    toggleSideNav = () => {
        if (typeof window.AsyncSideBarInstance_ !== 'undefined') {
            if (ReactDOM.findDOMNode(this).classList.contains('side-nav--visible')) {
                this.closeSideNav(); }
            else{
                this.openSideNav(); }
        } else {
            asyncSideBarInstance().then(load => {
                load.loadCSS('/styles/sidenav.css').then(() => {
                    if (ReactDOM.findDOMNode(this).classList.contains('side-nav--visible')) {
                        this.closeSideNav(); }
                    else{
                        this.openSideNav(); }
                });
            });
        }
    }

    openSideNav = () => {
        this.addEventListeners();
        ReactDOM.findDOMNode(this).classList.add('side-nav--visible');
        var onSideNavTransitionEnd = () => {
            // Force the focus, otherwise touch doesn't always work.
            ReactDOM.findDOMNode(this.refs.sideNavContent).focus();

            ReactDOM.findDOMNode(this.refs.sideNavContent).classList.remove('side-nav__content--animatable');
            ReactDOM.findDOMNode(this.refs.sideNavContent).removeEventListener('transitionend',
                onSideNavTransitionEnd);
        }
            ReactDOM.findDOMNode(this.refs.sideNavContent).classList.add('side-nav__content--animatable');
            ReactDOM.findDOMNode(this.refs.sideNavContent).addEventListener('transitionend', onSideNavTransitionEnd);
            requestAnimationFrame( () => {
                ReactDOM.findDOMNode(this.refs.sideNavContent).style.transform = 'translateX(0px)';
            });
    }

    closeSideNav = () => {
        ReactDOM.findDOMNode(this).classList.remove('side-nav--visible');
        ReactDOM.findDOMNode(this.refs.sideNavContent).classList.add('side-nav__content--animatable');
        ReactDOM.findDOMNode(this.refs.sideNavContent).style.transform = 'translateX(-102%)';

        let onSideNavClose = () => {
            ReactDOM.findDOMNode(this).removeEventListener('transitionend', onSideNavClose);
            this.removeEventListeners();
        }
        ReactDOM.findDOMNode(this).addEventListener('transitionend', onSideNavClose);
        
    }

    addEventListeners = () => {
        ReactDOM.findDOMNode(this).addEventListener('click', () => {
            this.closeSideNav();
        });
        ReactDOM.findDOMNode(this.refs.sideNavContent).addEventListener('click', (e) => {
            e.stopPropagation();
        });
        ReactDOM.findDOMNode(this.refs.sideNavContent).addEventListener('touchstart', this.onSideNavTouchStart, {capture: true});
        ReactDOM.findDOMNode(this.refs.sideNavContent).addEventListener('touchmove', this.onSideNavTouchMove,{capture: true});
        ReactDOM.findDOMNode(this.refs.sideNavContent).addEventListener('touchend', this.onSideNavTouchEnd, {capture: true});
    }

    removeEventListeners = () => {
        ReactDOM.findDOMNode(this).removeEventListener('click', () => {
            this.closeSideNav();
        });
        ReactDOM.findDOMNode(this.refs.sideNavContent).removeEventListener('click', (e) => {
            e.stopPropagation();
        });
        ReactDOM.findDOMNode(this.refs.sideNavContent).removeEventListener('touchstart', this.onSideNavTouchStart);
        ReactDOM.findDOMNode(this.refs.sideNavContent).removeEventListener('touchmove', this.onSideNavTouchMove);
        ReactDOM.findDOMNode(this.refs.sideNavContent).removeEventListener('touchend', this.onSideNavTouchEnd);
    }


    render() {
        const { auth } = this.props;
        return (
            <div className="side-nav js-side-nav">
                <div ref="sideNavContent" className="side-nav__content js-side-nav-content">
                    <div className="side-nav__header">
                        <div className="col_xs_9">
                            <h1 className="side-nav__title">{auth.get('user')}</h1>
                            <h1 className="side-nav__subtitle">{ auth.get('loaded') && auth.get('id') !== null ? auth.get('category') + ' consultant' : '' }</h1>
                        </div>
                    </div>
                    <div className="side-nav__body">
                       { auth.get('loaded') && auth.get('id') !== null ? 
                        <div>
                        <button className="side-nav__delete-memos"><a target="_blank" href={'https://expertmile.com/newview.php?profID=' + auth.get('id')}>My Profile</a></button>
                        <a target="_blank" href="https://expertmile.com/dashboard/leads" className="side-nav__my-leads">Leads</a>
                        <a target="_blank" href="https://expertmile.com/expertfree/#/biding" className="side-nav__new-assign">Assignments</a>
                        <a target="_blank" href="https://expertmile.com/dashboard/messages" className="side-nav__inbox">Inbox</a>
                        <a target="_blank" href="https://expertmile.com/dashboard/digitalcards" className="side-nav__cards">Digital Cards</a>
                        <a target="_blank" href="https://expertmile.com/dashboard/articles" className="side-nav__articles">Articles</a>
                        <a target="_blank" href="https://expertmile.com/chart/expert-analysis/index.php" className="side-nav__analytics">Analytics</a>
                        <a target="_blank" href="https://expertmile.com/miles/" className="side-nav__miles">Miles</a> 
                        </div> :
                        <div>
                            <button tabIndex="-1" className="side-nav__delete-memos"><a target="_blank" href="../index.php">Home</a></button>
                            <a tabIndex="-1" target="_blank" href="../articles.php" className="side-nav__articles">Articles</a>
                        </div>
                      }
                    </div>
                </div>
            </div>
        )
    };
}