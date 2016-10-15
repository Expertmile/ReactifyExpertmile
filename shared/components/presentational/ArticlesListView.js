import React, { PropTypes }      from 'react/lib/React';
import ImmutablePropTypes        from 'react-immutable-proptypes';
import LazyLoad                  from 'react-lazyload/lib/index';
import browserHistory            from 'react-router/lib/browserHistory';

export default class ArticlesListView extends React.Component {
  static propTypes = {
    articleIdsOrdered:      ImmutablePropTypes.list.isRequired,
    auth:                   ImmutablePropTypes.map.isRequired,
    selectArticle:          PropTypes.func.isRequired,
    editable:               PropTypes.bool.isRequired
  };

  handleClick = (article) => {
    let articleName = article.get('article_name').trim().replace(/[\. ,:-]+/g, '-').toLowerCase();
    browserHistory.push(`/article/${article.get('article_id')}/${articleName}`)
  }

  render() {
    const { articleIdsOrdered, selectArticle, editable, auth } = this.props;
    const styles = require('../../scss/master.scss');
    return (
      <div>
        { articleIdsOrdered.map((id, index) => {
            var article = selectArticle(id);
          return (
                <div className={styles.timeline_card} key={index}>
                    <div className={styles.card_body} onClick={() => this.handleClick(article)}>
                        <h2>{article.get('article_name') }</h2>
                        <p>{!!article.get('shortDescription') ?  article.get('shortDescription') + '...': article.get('ArticleDescription')}</p>
                        <div className={styles.imagecontainer}>
                        <LazyLoad height={0} throttle={200} once>
                            <img src={article.get('ProfilePic') === null || '' ? '/images/blank.png' : '/images/blank.png'} className={styles.detailed_imageName} width="45" height="45" />
                        </LazyLoad>
                        <span>{article.get('category') !== 'normal'? 
                        <a href={'https://expertmile.com/newview.php?profID=' + article.get('ID')}>{article.get('Fname') + ' ' + article.get('Lname') }</a>
                        : article.get('Fname') + ' ' + article.get('Lname') }</span>
                        <span>
                            {!article.get('Designation') || ' ' ? '' : article.get('Designation') + ', '}
                            {!article.get('Organization') || '' ? '' : article.get('Organization') }
                        </span>
                    
                        { auth.get('id') === article.get('Status_Creator') ?
                            <div onClick={openMenuBar} className={styles.detect_click}><i className={styles.icono_tiles}></i></div>
                            : <span className={styles.time_ago}>{article.get('Time_Ago')}</span> }
                        </div>
                    </div>
                </div>    
          );
        })
        }
      </div>
    );
  }
}
