import React                        from 'react/lib/React';
import ReactDOM  	                  from 'react-dom';
import browserHistory               from 'react-router/lib/browserHistory';
import * as TodoActions             from '../actions/TodoActions';
import { selectPost, isEditable }   from '../reducers/PostsReducer';
import connect                      from 'react-redux/lib/components/connect';
import Toaster                      from './Toaster';
import asyncLoaderInstance	        from '../instances/AsyncLoaderInstance';

@connect(state => ({
  posts:          state.posts,
  todoIdsOrdered: state.todoIdsOrdered,
  pagination:     state.pagination,
  loadComment:    state.loadComment,
  selectPost:     selectPost.bind(null, state),
  auth:           state.auth,
  fab:            state.fab,
  statusCreator:  state.statusCreator,
  editable:       isEditable(state)
}),
  TodoActions
)
export default class StatusPanel extends React.Component {

  componentDidMount() {
    const { params, selectPost } = this.props;
    this.view = ReactDOM.findDOMNode(this).querySelector('.js-details-view');
    this.reveal = this.view.querySelector('.js-box-reveal');
    this.panel = this.view.querySelector('.js-details-panel');

    this.viewport600px = window.matchMedia('(min-width: 600px)').matches;
    this.viewport960px = window.matchMedia('(min-width: 960px)').matches;
    if (typeof window.AsyncLoaderInstance_ !== 'undefined') {
      this.show();
    } else {
      asyncLoaderInstance().then(load => {
        load.loadCSS('/timeline/styles/detailedPanel.css').then(() => {
          this.show();
        });
      });
    }
    if(params.id > 2 ) {
      let newstatus =  selectPost(params.id).get('Status_Value').replace(/(<([^>]+)>)/ig,'');
      ReactDOM.findDOMNode(this.refs.editor).textContent = newstatus;
    }
  }

  show() {
    this.view.classList.add('details-view--visible');
    this.reveal.classList.add('details-view__box-reveal--visible');
    this.view.classList.remove('hidden');
    this.panel.style.transform = '';

    this.reveal.classList.add('details-view__box-reveal--expanded');
    this.panel.classList.add('details-view__panel--visible');
    ReactDOM.findDOMNode(this.refs.underPanel).classList.add('view-underpanel--visible');


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

    var locate = setTimeout(() => {
        this.reveal.classList.add('details-view__box-reveal--animatable');
        this.reveal.classList.add('details-view__box-reveal--expanded');
        this.panel.classList.add('details-view__panel--visible');
        this.panel.classList.add('details-view__panel--animatable');
        requestAnimationFrame(() => {
          this.reveal.style.transform = '';
          this.panel.style.transform = '';
        });
      clearTimeout(locate);
    }, 2);
  };

  hide() {
   
    this.view.classList.remove('details-view--visible');
    this.panel.classList.remove('details-view__panel--visible');
    this.reveal.classList.remove('details-view__box-reveal--expanded');
    this.reveal.classList.add('details-view__box-reveal--animatable');

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
        this.panel.classList.remove('details-view__panel--animatable');

        this.reveal.removeEventListener('transitionend', removeRevealTransform);
        this.reveal.classList.remove('details-view__box-reveal--animatable');
        this.reveal.style.transform = '';
        this.panel.style.transform = '';
         if (this.props.params.id == 1) {
            browserHistory.goBack('/timeline/');
          } else {
            browserHistory.goBack('/timeline/answer');
          }
      }

      var hideElements = () => {
        this.reveal.removeEventListener('transitionend', hideElements);
        this.reveal.addEventListener('transitionend', removeRevealTransform);
        this.reveal.classList.remove('details-view__box-reveal--visible');
      }

      ReactDOM.findDOMNode(this.refs.underPanel).classList.remove('view-underpanel--visible');
      this.reveal.addEventListener('transitionend', hideElements);
      if (this.viewport960px)
        this.reveal.classList.remove('details-view__box-reveal--visible');

      if (this.viewport600px)
        return;
    });
  }

  emitChange = () => {
    this.props.handleStatus(ReactDOM.findDOMNode(this.refs.editor).innerText);
  }

  handleBackButton = () => {
    this.hide();
  }

  urlify(text) {
      var urlRegex = /(https?:\/\/[^\s]+)/g;
      return text.replace(urlRegex, function(url) {
          return '<a href="' + url + '">' + url + '</a>';
      })
  }

  postStatus = () => {
    var finalStatus = this.urlify(ReactDOM.findDOMNode(this.refs.editor).innerText);
    this.props.postStatus(this.props.auth.get('id'), finalStatus, this.props.auth.get('category'));
    this.hide();
  }

  editStatus = () => {
    const { params } = this.props;
    var finalStatus = this.urlify(ReactDOM.findDOMNode(this.refs.editor).innerText);
    this.props.editStatus( params.id, finalStatus);
    if(this.viewport960px) {
      browserHistory.push('/timeline/');
    } else {
      browserHistory.push('/timeline/post/' + params.id);
    }
  }

  render() {
    return (
      <div>
        <div ref="underPanel" className="view-underpanel js-underpanel">
          <div className="view-underpanel__block"></div>
        </div>
        <section className="hidden details-view js-details-view">

          <div className="details-view__panel js-details-panel">

            <div className="details-view__header js-details-panel-header">
              <div className="details-view__header-buttons">
                <button onClick={this.handleBackButton} className="details-view__back js-back"></button>
              </div>
              <h1 className="details-view__title js-title">Share</h1>
            </div>

            <aside className="details-view__content">
              <div onInput={this.emitChange} contentEditable={true} placeholder="What's your professional update ..?"
                ref="editor" className="mdl-commentpanel__editor" spellCheck={true} />
            </aside>

            { this.props.editable ? <div className="details-view__footer_status">
              {this.props.params.id > 2 ? 
                <button onClick={this.editStatus} className="details-view__playback-toggle">UPDATE</button> :
                <button onClick={this.postStatus} className="details-view__playback-toggle">SHARE</button> }
            </div> : '' }

          </div>

          <div className="details-view__box-reveal js-box-reveal"></div>
          <Toaster ref="toaster"/> 
        </section>
      </div>
    )
  }
}