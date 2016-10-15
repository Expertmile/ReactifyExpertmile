import React                        from 'react/lib/React';
import ReactDOM  	                  from 'react-dom';
import browserHistory               from 'react-router/lib/browserHistory';
import * as MoreActions             from '../actions/MoreActions';
import connect                      from 'react-redux/lib/components/connect';
import Toaster                      from './Toaster';
import asyncMorePanelInstance	      from './AsyncMorePanelInstance';
import Articles                     from './presentational/Articles';
import Assignments                  from './presentational/Assignments';
import fetchData                    from '../lib/fetchDataDeferred';

@fetchData((state, dispatch) => dispatch(MoreActions.loadAuth()).then((res) => {
  // implement error handler here
    if(typeof state !== 'undefined') {
          return dispatch(MoreActions.loadArticles(res.data.id)).then(() => {
            return dispatch(MoreActions.loadAssignments());
          })  
    } else {
         return dispatch(MoreActions.loadArticles(res.data.id)).then(() => {
            return dispatch(MoreActions.loadAssignments());
         });
    }
}))
@connect(state => ({
  auth:    state.auth,
  profile: state.profile
}),
  MoreActions
)
export default class MoreRoute extends React.Component {

  componentDidMount() {
    this.view = ReactDOM.findDOMNode(this).querySelector('.js-details-view__more');
    this.reveal = this.view.querySelector('.js-box-reveal');
    this.panel = this.view.querySelector('.js-details-panel');

    this.viewport600px = window.matchMedia('(min-width: 600px)').matches;
    this.viewport960px = window.matchMedia('(min-width: 960px)').matches;
    if (typeof window.asyncMoreInstance_ !== 'undefined') {
         this.show();
      } else {
        asyncMorePanelInstance().then(load => {
          load.loadCSS('./styles/moreRoute.css').then(() => {
             this.show();
          });
        });
      }
  }

  show() {
    this.view.classList.add('details-view__more--visible');
    this.reveal.classList.add('details-view__more__box-reveal--visible');
    this.view.classList.remove('hidden');
    this.panel.style.transform = '';

    this.reveal.classList.add('details-view__more__box-reveal--expanded');
    this.panel.classList.add('details-view__more__panel--visible');
    ReactDOM.findDOMNode(this.refs.underPanel).classList.add('view-underpanel__more--visible');


    if (this.viewport960px) {
      this.panel.style.transform = 'translateY(300px)';
      this.reveal.style.transform = 'translateY(300px)';
    } else if (this.viewport600px) {
      this.panel.style.transform = 'translateX(1050px)';
      this.reveal.style.transform = 'translateX(1050px)';
    } else {
      this.panel.style.transform = 'translateX(1050px)';
      this.reveal.style.transform = 'translateX(1050px)';
    }

    setTimeout(() => {
      requestAnimationFrame(() => {
        this.reveal.classList.add('details-view__more__box-reveal--animatable');
        this.reveal.classList.add('details-view__more__box-reveal--expanded');
        this.reveal.style.transform = '';

        this.panel.classList.add('details-view__more__panel--visible');
        this.panel.classList.add('details-view__more__panel--animatable');
        this.panel.style.transform = '';
        
      });
    }, 2);
  };

  hide() {
   
    this.view.classList.remove('details-view__more--visible');
    this.panel.classList.remove('details-view__more__panel--visible');
    this.reveal.classList.remove('details-view__more__box-reveal--expanded');
    this.reveal.classList.add('details-view__more__box-reveal--animatable');

    requestAnimationFrame(() => {
      if (this.viewport960px) {
        this.panel.style.transform = 'translateY(300px)';
        this.reveal.style.transform = 'translateY(300px)';
      } else if (this.viewport600px) {
        this.panel.style.transform = 'translateX(1050px)';
        this.reveal.style.transform = 'translateX(1050px)';
      } else {
        this.panel.style.transform = 'translateX(1050px)';
        this.reveal.style.transform = 'translateX(1050px)';
      }

      var removeRevealTransform = () => {
        this.panel.classList.remove('details-view__more__panel--animatable');

        this.reveal.removeEventListener('transitionend', removeRevealTransform);
        this.reveal.classList.remove('details-view__more__box-reveal--animatable');
        this.reveal.style.transform = '';
        this.panel.style.transform = '';
         if (this.props.params.id == 1) {
            browserHistory.goBack('/');
          } else {
            browserHistory.goBack('/answer');
          }
      }

      var hideElements = () => {
        this.reveal.removeEventListener('transitionend', hideElements);
        this.reveal.addEventListener('transitionend', removeRevealTransform);
        this.reveal.classList.remove('details-view__more__box-reveal--visible');
      }

      ReactDOM.findDOMNode(this.refs.underPanel).classList.remove('view-underpanel__more--visible');
      this.reveal.addEventListener('transitionend', hideElements);
      if (this.viewport960px)
        this.reveal.classList.remove('details-view__more__box-reveal--visible');

      if (this.viewport600px)
        return;
    });
  }

  handleBackButton = () => {
    this.hide();
  }


  render() {
    const { profile } = this.props;
    return (
      <div>
        <div ref="underPanel" className="view-underpanel__more js-underpanel">
          <div className="view-underpanel__more__block"></div>
        </div>
        <section className="hidden details-view__more js-details-view__more">

          <div className="details-view__more__panel js-details-panel">

            <div className="details-view__more__header js-details-panel-header">
              <div className="details-view__more__header-buttons">
                <button onClick={this.handleBackButton} className="details-view__more__back js-back"></button>
                <a href="https://expertmile.com/edit-profile/editprofile.php"><button tabIndex="-1" className="details-view__more__edit js-edit">Edit</button></a>
                <center><img src="./images/blank.gif" className="details-view__more__image js-image" width="75px" height="75px"/></center>
                <h1 className="details-view__more__name js-name">{this.props.auth.get('user')}</h1>
                <p className="details-view__more__category js-category">{this.props.auth.get('category')}</p>
                <a href="https://expertmile.com/uploadarticle/"><button className="edit-profile--btn js-edit-profile--btn">
                    New Post
                </button></a>
              </div>
            </div>

            <aside className="details-view__more__content">
                <Articles article={profile.get('articles')}/>
                <Assignments assignment={profile.get('assignments')} />
            </aside>
          </div>

          <div className="details-view__more__box-reveal js-box-reveal"></div>
          <Toaster ref="toaster"/> 
        </section>
      </div>
    )
  }
}