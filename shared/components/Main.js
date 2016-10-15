import React, { PropTypes }       from 'react/lib/React';
import connect                    from 'react-redux/lib/components/connect';
import ImmutablePropTypes         from 'react-immutable-proptypes';
import fetchData                  from '../lib/fetchDataDeferred';
import $                          from 'jquery/dist/jquery.slim.min.js';
import PostsView                  from './presentational/PostsView';
import StatusLoader               from './presentational/StatusLoader';
import Header                     from './presentational/Header';
import FabButton                  from './presentational/FabButton';
import TabPanel                   from './presentational/TabPanel';
import Notification               from './presentational/Notification';
import * as TodoActions           from '../actions/TodoActions';
import { selectPost, isEditable } from '../reducers/PostsReducer';
import browserHistory             from 'react-router/lib/browserHistory';
import MenuBar                    from './MenuBar';
import Dialog                     from './Dialog';
import Toaster                    from './Toaster';
import toasterInstance	          from '../instances/ToasterInstance';
import menuInstance	              from '../instances/MenuInstance';
import shareInstance	            from '../instances/ShareInstance';
import Share                      from './Share';
import passiveEventListeners      from './listeners/supportForPassiveListener';

@connect(state => ({
  posts:          state.posts,
  todoIdsOrdered: state.todoIdsOrdered,
  pagination:     state.pagination,
  selectPost:     selectPost.bind(null, state),
  auth:           state.auth,
  fab:            state.fab,
  statusCreator:  state.statusCreator,
  editable:       isEditable(state)
}),
  TodoActions
)
@fetchData((state, dispatch, params) => dispatch(TodoActions.loadAuth()).then((res) => {
  if(Object.keys(params).length === 0 && typeof state !== 'undefined' && state.queries.size === 0){
        return dispatch(TodoActions.loadPosts(res.data.id))    
    } else {
        return dispatch(TodoActions.loadPosts(res.data.id))
    }
}))

export default class Main extends React.Component {
  static propTypes = {
    posts:                 ImmutablePropTypes.map.isRequired,
    auth:                  ImmutablePropTypes.map.isRequired,
    fab:                   ImmutablePropTypes.map.isRequired,
    pagination:            ImmutablePropTypes.map.isRequired,
    statusCreator:         ImmutablePropTypes.map.isRequired,
    todoIdsOrdered:        ImmutablePropTypes.list.isRequired,
    selectPost:            PropTypes.func.isRequired,
    readMore:              PropTypes.func.isRequired,
    editable:              PropTypes.bool.isRequired,
    loadMore:              PropTypes.func.isRequired,
    loadComments:          PropTypes.func.isRequired,
    addComment:            PropTypes.func.isRequired,
    sendNotification:      PropTypes.func.isRequired,
    setNotificationData:   PropTypes.func.isRequired,
    resetNotificationData: PropTypes.func.isRequired,
    loadAuth:              PropTypes.func.isRequired,
    handleCommentDelete:   PropTypes.func.isRequired,
    showFabButton:         PropTypes.func.isRequired,
    handleStatus:          PropTypes.func.isRequired,
    postStatus:            PropTypes.func.isRequired,
    handleLike:            PropTypes.func.isRequired,
    handleUnlike:          PropTypes.func.isRequired,
    hideFabButton:         PropTypes.func.isRequired,
    handleDeletePost:      PropTypes.func.isRequired,
    handleHelpful:         PropTypes.func.isRequired,
    handleImprove:         PropTypes.func.isRequired,
    loadPosts:             PropTypes.func.isRequired
  };

  componentDidMount() {
    this.props.loadAuth().then((res) => this.props.loadPosts(res.data.id));
    window.$ = $;
    window.addEventListener('scroll', this.handleScroll,
    passiveEventListeners ? {passive: true} : false);
    this.viewport960px = window.matchMedia('(min-width: 960px)').matches;
  };

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  };

  shouldComponentUpdate(nextProps) {
    const { posts, pagination, auth,  fab, children } = this.props;
    return !posts.equals(nextProps.posts) || !pagination.equals(nextProps.pagination) ||
      !auth.equals(nextProps.auth) || fab.get('show') != nextProps.fab.get('show') || children != nextProps.children;
  };

  readMore = (id, text) => {
    this.props.readMore(id, text);
  };

  handleComment = (id) => {
    this.props.loadComments(id, this.props.auth.get('id'));
  };

  handleStatus = (post) => {
    this.props.handleStatus(post);
  };

  handleMenuBar = (id) => {
    menuInstance()
      .then(() => {
        return this.refs.menu.show(id);
      }).then((data) => {
        this.handleMenuPop(data);
      })
  }

  scrollHandler = () => {
    const { pagination, fab, auth } = this.props;
    const { loading, currentPage } = pagination.toObject();
    const { currentPos } = fab.toObject();
    if(!this.viewport960px) {
    if ($(window).scrollTop() >= currentPos) {
        this.props.hideFabButton($(window).scrollTop());
      } else {
        this.props.showFabButton($(window).scrollTop());
      }
    }
    //handle infinite scrolling event for posts
    if ($(window).scrollTop() + $(window).height() >= $(document).height()) {
      if (loading != 1) {
        this.props.loadMore(currentPage + 1, auth.get('id'));
        window.scrollTo(0, $(document).height());
      }
    }
  }

  handleScroll = () => {
    window.requestAnimationFrame(this.scrollHandler);
  };

  handleNewComment = (text, id) => {
    this.props.addComment(text, id, this.props.auth.get('id'))
      .then((res) => {
        let author = false;
        let authorID = this.props.selectPost(id).get('Status_Creator');
        let name = res.data[0].Fname + ' ' + res.data[0].Lname;
        if(authorID === this.props.auth.get('id')) {
            author = true;
            this.props.setNotificationData(id, author, name, res.data[0].ProfilePic).then(() => {
                this.props.sendNotification(author, authorID, id, this.props.auth.get('id'));
            });
        } else {
            author = false;
            this.props.setNotificationData(id, author, name, res.data[0].ProfilePic).then(() => {
                this.props.sendNotification(author, authorID, id, this.props.auth.get('id'));
            });
        }
      });
  };

  handleFab = () => {
      browserHistory.push('/create/1');
  }

  openCommentPanel = (id) => {
      browserHistory.push(`/post/${id}`);
  }

  handleMenuPop = (data) => {
    if (data.button === 'edit') {
      browserHistory.push(`/create/${data.postID}`);
    } else {
      menuInstance()
        .then(() => {
          return this.refs.dialog.show(
            'Confirm Delete',
            'Are you sure you want to delete this update?',
            data.postID
          );
        }).then((idToDelete) => {
          this.props.handleDeletePost(idToDelete, this.props.auth.get('id'));
        })
    }
  }

  handleShare = (id, text) => {
    shareInstance().then(() => {
      return this.refs.share.show(
        id, text
      );
    })
  }

  handleLike = (statusID, currentValue) => {
    this.props.handleLike(statusID, currentValue, this.props.auth.get('id')).then((response) => {
        toasterInstance().then(() => {
            if(response === 401) {
              this.refs.toaster.show('Please login first'); 
            }
        });
    });
  }

  handleUnlike = (statusID, currentValue) => {
    this.props.handleUnlike(statusID, currentValue, this.props.auth.get('id')).then((response) => {
       toasterInstance().then(() => {
            if(response === 401) {
              this.refs.toaster.show('Please login first'); 
            } 
        });
    })
  }

  handleHelpful = (postID, commentID, Index, helpValue, unHelpValue) => {
    this.props.handleHelpful(postID, commentID, Index, helpValue, unHelpValue, this.props.auth.get('id'));
  }

  handleImprove = (postID, commentID, Index, helpValue, unHelpValue) => {
    this.props.handleImprove(postID, commentID, Index, helpValue, unHelpValue, this.props.auth.get('id'));
  }

  handleCommentDelete = (postID, commentID, Index) => {
    this.props.handleCommentDelete(postID, commentID, Index);
  }

  handleTab = (tabId) => {
    if (tabId === 2)
      browserHistory.push('/articles/list');
    else if (tabId === 1)
      browserHistory.push('/');
    else if (tabId === 3)
      browserHistory.push('/more')
    else
      browserHistory.push('/');
  }

  render() {
    const { todoIdsOrdered, selectPost, pagination, fab, auth, editable } = this.props;
    const { show } = fab.toObject();
    const { loading } = pagination.toObject();
    const styles = require('../scss/master.scss');
    return (
      <div>

        <Header auth={auth} fab={fab} title="Timeline"/>

        {show ? <FabButton ref="fab" handleClick={this.handleFab} className="hidden_lg"/> : '' }

        <div className="hidden_lg hidden_md">
          <TabPanel selectTab={this.handleTab} viewport960px={this.viewport960px} />
        </div> 

        <MenuBar ref="menu" />

        <Dialog ref="dialog" />

        <Share ref="share" />

        <div>{this.props.children}</div>

        <div className={styles.content}>
        
          <section>
            <div className={styles.section_body}>
              <div className="row">
               
                <div className="col_lg_6 col_lg_offset_3 col_sm_8 col_sm_offset_2">
                <Notification className="hidden_xs" />
                
                    <PostsView 
                        selectPost={selectPost} 
                        todoIdsOrdered={todoIdsOrdered} 
                        handleComment={this.handleComment}
                        handleDelete={this.handleDelete}
                        handleImprove={this.handleImprove}
                        handleHelpful={this.handleHelpful}   
                        readMore={this.readMore} 
                        handleLike={this.handleLike} 
                        handleUnlike={this.handleUnlike}
                        viewport960px={this.viewport960px}
                        onCommentDelete={this.handleCommentDelete}
                        openCommentPanel={this.openCommentPanel} 
                        onShareClick={this.handleShare} 
                        handleMenuBar={this.handleMenuBar} 
                        handleNewComment={this.handleNewComment} 
                        editable={editable} 
                        auth={auth} />
                        
                    <div>{loading != 0 || todoIdsOrdered.size === 0 ? <div><StatusLoader /><StatusLoader /></div> : null}</div>
                  </div>
                </div>
              </div>
          </section>
          <Toaster ref="toaster"/> 
        </div>
      </div>
    );
  }
}
