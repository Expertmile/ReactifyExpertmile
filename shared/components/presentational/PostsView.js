import React, { PropTypes }   from 'react/lib/React';
import ImmutablePropTypes   from 'react-immutable-proptypes';
import PostItem            from './PostItem';

export default class PostsView extends React.Component {
  static propTypes = {
    todoIdsOrdered:   ImmutablePropTypes.list.isRequired,
    auth:             ImmutablePropTypes.map.isRequired,
    selectPost:       PropTypes.func.isRequired,
    editable:         PropTypes.bool.isRequired,
    readMore:         PropTypes.func.isRequired,
    handleComment:    PropTypes.func.isRequired,
    handleNewComment: PropTypes.func.isRequired,
    openCommentPanel: PropTypes.func.isRequired,
    handleLike:       PropTypes.func.isRequired,
    handleUnlike:     PropTypes.func.isRequired,
    handleMenuBar:    PropTypes.func.isRequired,
    handleImprove:    PropTypes.func.isRequired,
    handleHelpful:    PropTypes.func.isRequired,
    onCommentDelete:  PropTypes.func.isRequired,
    onShareClick:     PropTypes.func.isRequired
  };

  render() {
    const { todoIdsOrdered, selectPost, onShareClick, handleHelpful, handleImprove, onCommentDelete, viewport960px,handleComment, openCommentPanel, handleMenuBar, handleLike, handleUnlike, readMore, handleNewComment, editable, auth } = this.props;
    return (
      <div>
        { todoIdsOrdered.map((id, index) => {
          return (
            <PostItem key={index}
              onComment={() => handleComment(id) }
              editable={editable}
              onReadMore={() => readMore(id, selectPost(id)) }
              posts={selectPost(id) }
              handleMenuBar = {() => handleMenuBar(id) }
              handleCommentPanel = {() => openCommentPanel(id) }
              viewport960px={viewport960px}
              onHelpful={(commentID, Index, helpValue, unHelpValue) => handleHelpful(id, commentID, Index, helpValue, unHelpValue) }
              onImprove={(commentID, Index, helpValue, unHelpValue) => handleImprove(id, commentID, Index, helpValue, unHelpValue) }
              handleCommentDelete={(commentID, Index) => onCommentDelete(id, commentID, Index)}
              auth={auth}
              handleShare={(text) => onShareClick(id, text)}
              handleNewComment={(text) => handleNewComment(text, id) }
              onPostLike={() => handleLike(id, selectPost(id).get('likes')) }
              onPostUnlike={() => handleUnlike(id, selectPost(id).get('likes')) } />
          );
        })
        }
      </div>
    );
  }
}
