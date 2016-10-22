import React                                    from 'react/lib/React'
import ReactDOM                                 from 'react-dom'
import connect                                  from 'react-redux/lib/components/connect';
import ImmutablePropTypes                       from 'react-immutable-proptypes';
import fetchData                                from '../lib/fetchDataDeferred';
import browserHistory                           from 'react-router/lib/browserHistory';
import $                                        from 'jquery/dist/jquery.slim.min.js';
import * as ArticleActions                      from '../actions/ArticleActions';
import Header                                   from './presentational/Header';
import passiveEventListeners                    from './listeners/supportForPassiveListener';
import { selectDetailedArticle, isEditable }    from '../reducers/ArticleDetailReducer';
import StatusLoader                             from './presentational/StatusLoader';
import ArticleDetailView                        from './presentational/ArticleDetailView';
import toasterInstance	                        from '../instances/ToasterInstance';
import Toaster                                  from './Toaster';
import asyncToasterInstance	                    from '../instances/AsyncToasterInstance';

@connect(state => ({
    articles:                       state.articles,
    articleDetail:                  state.articleDetail,
    articleDetailIdsOrdered:        state.articleDetailIdsOrdered,
    auth:                           state.auth,
    pagination:                     state.paginateArticlesDetails,
    selectDetailedArticle:          selectDetailedArticle.bind(null, state),
    editable:                       isEditable(state)
}),
    ArticleActions
)
@fetchData((state, dispatch, params) => dispatch(ArticleActions.loadAuth())
    .then(() => dispatch(ArticleActions.loadDetailedArticle(params.id, 1))))

export default class ArticleDetail extends React.Component {
    constructor() {
        super();
    }

    componentDidMount() {
        window.$ = $;
        window.addEventListener('scroll', this.handleScroll,
        passiveEventListeners ? {passive: true} : false);
    };

    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
    };

    scrollHandler = () => {
        const { pagination } = this.props;
        const { loading, currentPage } = pagination.toObject();
        //handle infinite scrolling event for articles
        if ($(window).scrollTop() + $(window).height() >= $(document).height()) {
            if (loading != 1) {
                this.props.loadMoreDetailedArticle(currentPage + 1);
            }
        }
    }

    handleScroll = () => {
        window.requestAnimationFrame(this.scrollHandler);
    };

    handleNewComment = (comment, auth, index) => {
        this.props.postNewComment(comment, auth, index).then((response) => {
            if (typeof window.AsyncToasterInstance_ !== 'undefined') {
                toasterInstance().then(() => {
                    this.refs.toaster.show('Please login first'); 
                });
            } else {
                asyncToasterInstance().then(load => {
                    load.loadCSS('/styles/toaster.css').then(() => {
                        toasterInstance().then(() => {
                            if(response.status === 200) {
                                this.refs.toaster.show('Comment posted successfully'); 
                            } else if(response.status === 500){
                                this.refs.toaster.show('Error..! Please try again.');
                            } else {
                                this.refs.toaster.show('No internet connection detected.');
                            }
                        });
                    });
                });
            }
        });
    }

    render() {
        const { auth, articleDetail, articleDetailIdsOrdered, selectDetailedArticle, editable } = this.props;
        const styles = require('../scss/master.scss');
        return (
            <div   className={styles.articleBody}>
                <Header auth={auth} title="Articles"/>
                <Toaster ref="toaster"/> 
                <div className={styles.content}>
                    <section>
                        <div className={styles.section_body}>
                            <div className="row">
                                <div className="col_lg_12 col-sm-12">
                                    <ArticleDetailView 
                                        selectDetailedArticle={selectDetailedArticle} 
                                        articleDetailIdsOrdered={articleDetailIdsOrdered} 
                                        editable={editable} 
                                        handleNewComment={this.handleNewComment}
                                        auth={auth} />
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        )
    }
}