import React, { PropTypes }        from 'react/lib/React';
import ImmutablePropTypes          from 'react-immutable-proptypes';
import LazyLoad                    from 'react-lazyload/lib/index';
import browserHistory              from 'react-router/lib/browserHistory';
import ReactDOM                    from 'react-dom';
import InputComment  	             from './InputComment';



export default class ArticleDetailView extends React.Component {
  constructor(props) {
      super(props);
      this.state = { html: '' };
  }

  static propTypes = {
    articleDetailIdsOrdered:      ImmutablePropTypes.list.isRequired,
    auth:                         ImmutablePropTypes.map.isRequired,
    selectDetailedArticle:        PropTypes.func.isRequired,
    handleNewComment:             PropTypes.func.isRequired,
    editable:                     PropTypes.bool.isRequired
  };

  
  handleChange = (event) => {
		this.setState({ html: event });
	}

	handleSubmit = (index) => {
		this.props.handleNewComment(this.state.html, this.props.auth.toJS(), index.toString());
		this.setState({ html: '' });
	}

  render() {
    const { articleDetailIdsOrdered, selectDetailedArticle, editable, auth } = this.props;
    const styles = require('../../scss/master.scss');
    var divStyle = {
  bacgroundk: '#006cb4'
};

    console.log(this.props);
    return (
      <div>
      
      
      <div className={"col_lg_8 col_lg_offset_2  col_sm_12"}>
        { articleDetailIdsOrdered.map((id, index) => {
          return (
            <div key={index} className={styles.timeline_card}>
                <div className={styles.card_body}>
                  <article>
                 
                  
                      <h1 className={styles.articleTitle}>{selectDetailedArticle(id).get('article_name')}</h1>
                      <a href={'https://expertmile.com/newview.php?profID=' + selectDetailedArticle(id).get('ID')}><span>By: {selectDetailedArticle(id).get('Fname') + ' ' + selectDetailedArticle(id).get('Lname')}</span></a>
                      
                      <h5>Comments: {selectDetailedArticle(id).get('comment_count')}</h5>
                      <p dangerouslySetInnerHTML={{ __html: selectDetailedArticle(id).get('content') }}></p>
                      <div>
                      <h4>Comments: </h4>
                      { editable ? 
                      <InputComment
                          html={this.state.html}
                          onChange={this.handleChange}
                          onSubmit={() => this.handleSubmit(selectDetailedArticle(id).get('article_id'))} /> 
                          : 
                       <div>
                       <h5>Please login to post your comment.</h5>
                       </div>   
                      }

                        { !!selectDetailedArticle(id).get('comments') && selectDetailedArticle(id).get('comments').map((comment, index) => {
                            return (
                              <div key={index}>
                                <p>{comment.get('com')}</p>
                                <a href={'https://expertmile.com/newview.php?profID=' + selectDetailedArticle(id).get('ID')}><span>By: {comment.get('Fname') + ' ' + comment.get('Lname')}</span></a>
                              </div>
                            )
                        })}
                      </div>
                  </article>
                 
                </div> 
                <br />
                 <hr />
            </div>
          );
        })
        }
      </div>
      
      

      </div>
    );
  }
}
