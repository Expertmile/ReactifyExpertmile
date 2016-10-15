import React                            from 'react/lib/React'
import ReactDOM                         from 'react-dom'
import connect                          from 'react-redux/lib/components/connect';
import ImmutablePropTypes               from 'react-immutable-proptypes';
import fetchData                        from '../lib/fetchDataDeferred';
import browserHistory                   from 'react-router/lib/browserHistory';
import $                                from 'jquery/dist/jquery.slim.min.js';
import * as ArticleActions              from '../actions/ArticleActions';
import Header                           from './presentational/Header';
import passiveEventListeners            from './listeners/supportForPassiveListener';
import { selectArticle, isEditable }    from '../reducers/ArticlesReducer';
import StatusLoader                     from './presentational/StatusLoader';
import ArticlesListView                 from './presentational/ArticlesListView';

@connect(state => ({
  articles:          state.articles,
  articleIdsOrdered: state.articleIdsOrdered,
  auth:              state.auth,
  pagination:        state.paginateArticles,
  selectArticle:     selectArticle.bind(null, state),
  editable:          isEditable(state)
}),
  ArticleActions
)
@fetchData((state, dispatch) => dispatch(ArticleActions.loadAuth())
    .then(() => dispatch(ArticleActions.loadArticleList(1))))

export default class ArticleMain extends React.Component {
  constructor() {
    super()
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
        this.props.loadMore(currentPage + 1);
      }
    }
  }

  handleScroll = () => {
    window.requestAnimationFrame(this.scrollHandler);
  };

  render() {
    const { articles, articleIdsOrdered, auth, editable, pagination, selectArticle } = this.props;
    const { loading } = pagination.toObject();
    const styles = require('../scss/master.scss');
    return (
        <div>
        <Header auth={auth} title="Articles"/>
        <div className={styles.content}>
            <section>
                <div className={styles.section_body}>
                    <div className="row">
                        <div className="col_lg_6 col_lg_offset_3 col_sm_8 col_sm_offset_2">
                            <ArticlesListView 
                                selectArticle={selectArticle} 
                                articleIdsOrdered={articleIdsOrdered} 
                                editable={editable} 
                                auth={auth} />
                            <div>{loading != 0 || articleIdsOrdered.size === 0 ? <div><StatusLoader /><StatusLoader /></div> : null}</div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
      </div>
    )
  }
}
