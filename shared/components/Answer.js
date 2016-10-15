import React, { PropTypes }       from 'react/lib/React';
import ReactDOM  	              from 'react-dom';
import connect                    from 'react-redux/lib/components/connect';
import ImmutablePropTypes         from 'react-immutable-proptypes';
import fetchData                  from '../lib/fetchDataDeferred';
import browserHistory             from 'react-router/lib/browserHistory';
import * as QueryActions           from '../actions/QueryActions';
import $                          from 'jquery/dist/jquery.slim.min.js';
import StatusLoader               from './presentational/StatusLoader';
import QueriesView                from './presentational/QueriesView';
import Header                     from './presentational/Header';
import FabButton                  from './presentational/FabButton';
import TabPanel                   from './presentational/TabPanel';
import MenuBar                    from './MenuBar';
import Dialog                     from './Dialog';
import menuInstance	              from '../instances/MenuInstance';
import shareInstance	          from '../instances/ShareInstance';
import asyncLoaderInstance	      from '../instances/AsyncLoaderInstance';
import Share                      from './Share';

import { selectQuery, isEditable }  from '../reducers/QueryReducer';

@fetchData((state, dispatch) =>  {
    if(typeof state !== 'undefined' && state.queries.size === 0) {
        return dispatch(QueryActions.loadAuth()).then((res) => dispatch(QueryActions.loadQueries(res.data.id)))  
    } else {
        return dispatch(QueryActions.loadAuth()).then((res) => dispatch(QueryActions.loadQueries(res.data.id)))
    }
})
@connect(state => ({
  queries:         state.queries,
  queryIdsOrdered: state.queryIdsOrdered,
  selectQuery:     selectQuery.bind(null, state),
  paginate:        state.paginateQuery,
  auth:            state.auth,
  fab:             state.fab,
  statusCreator:   state.statusCreator,
  editable:        isEditable(state)
}),
  QueryActions
)
export default class Answer extends React.Component {
static propTypes = {
    queries:             ImmutablePropTypes.map.isRequired,
    auth:                ImmutablePropTypes.map.isRequired,
    fab:                 ImmutablePropTypes.map.isRequired,
    paginate:            ImmutablePropTypes.map.isRequired,
    statusCreator:       ImmutablePropTypes.map.isRequired,
    queryIdsOrdered:     ImmutablePropTypes.list.isRequired,
    selectQuery:         PropTypes.func.isRequired,
    readMore:            PropTypes.func.isRequired,
    editable:            PropTypes.bool.isRequired,
    loadMoreQueries:     PropTypes.func.isRequired,
    loadComments:        PropTypes.func.isRequired,
    addComment:          PropTypes.func.isRequired,
    loadAuth:            PropTypes.func.isRequired,
    handleCommentDelete: PropTypes.func.isRequired,
    showFabButton:       PropTypes.func.isRequired,
    handleStatus:        PropTypes.func.isRequired,
    postStatus:          PropTypes.func.isRequired,
    handleLike:          PropTypes.func.isRequired,
    handleUnlike:        PropTypes.func.isRequired,
    hideFabButton:       PropTypes.func.isRequired,
    handleDeletePost:    PropTypes.func.isRequired,
    handleHelpful:       PropTypes.func.isRequired,
    handleImprove:       PropTypes.func.isRequired,
    loadQueries:         PropTypes.func.isRequired
};

componentDidMount() {
    window.$ = $;
    window.addEventListener('scroll', this.handleQueryScroll);
    this.viewport960px = window.matchMedia('(min-width: 960px)').matches;
    ReactDOM.findDOMNode(this.refs.fab).classList.add('new-recording-btn-hide');
};

componentWillUnmount() {
    window.removeEventListener('scroll', this.handleQueryScroll);
    ReactDOM.findDOMNode(this.refs.fab).classList.remove('new-recording-btn-hide');
};

shouldComponentUpdate(nextProps) {
    const { queries, auth, children } = this.props;
    return !queries.equals(nextProps.posts) || !auth.equals(nextProps.auth) 
    || children != nextProps.children;
};

  handleTab = (tabId) => {
    if (tabId === 2)
      browserHistory.push('/timeline/answer');
    else if (tabId === 1)
      browserHistory.push('/timeline/');
    else if (tabId === 3)
      browserHistory.push('/timeline/more')
    else
      browserHistory.push('/timeline/');
  }

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

queryHandler = () => {
    const { paginate, auth } = this.props;
    const { loading, currentPage } = paginate.toObject();

    //handle infinite scrolling event for posts
    if ($(window).scrollTop() + $(window).height() >= $(document).height()) {
        if (loading != 1) {
            this.props.loadMoreQueries(currentPage + 1, auth.get('id'));
            window.scrollTo(0, document.body.scrollHeight);
        }
    }
}

handleQueryScroll = () => {
    window.requestAnimationFrame(this.queryHandler);
};

handleNewComment = (text, id) => {
    this.props.addComment(text, id, this.props.auth.get('id'));
};

openCommentPanel = (id) => {
    browserHistory.push('/timeline/answer/query/' + id);
} 

handleMenuPop = (data) => {
    if (data.button === 'edit') {
        browserHistory.push(`/timeline/create/${data.postID}`);
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

postStatus = () => {
    this.props.postStatus(this.props.auth.get('id'), this.props.statusCreator.get('html'), this.props.auth.get('category'));
}

handleLike = (statusID, currentValue) => {
    this.props.handleLike(statusID, currentValue, this.props.auth.get('id'));
}

handleUnlike = (statusID, currentValue) => {
    this.props.handleUnlike(statusID, currentValue, this.props.auth.get('id'));
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

  
  render() {
    const { queryIdsOrdered, auth, fab, paginate, editable, selectQuery } = this.props;
    const styles = require('../scss/master.scss');
    const { loading } = paginate.toObject();
    return (
        <div>
            <Header auth={auth} fab={fab}/>

            <FabButton ref="fab" />

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
                            <QueriesView 
                                selectQuery={selectQuery} 
                                queryIdsOrdered={queryIdsOrdered} 
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
                            <div>{loading != 0 || queryIdsOrdered.size === 0 ? <div><StatusLoader /><StatusLoader /></div> : null}</div>
                        </div>
                        </div>
                    </div>
                </section>
            </div>

        </div>
        )
    }
}