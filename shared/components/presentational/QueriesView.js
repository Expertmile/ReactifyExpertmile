import React from 'react/lib/React';
import QueryItem from './QueryItem';

export default class QueriesView extends React.Component {
    constructor(Props){
        super(Props);
    }

    // static propTypes = {
    //     queryIdsOrdered:  ImmutablePropTypes.list.isRequired,
    //     auth:             ImmutablePropTypes.map.isRequired,
    //     selectQuery:      PropTypes.func.isRequired,
    //     editable:         PropTypes.bool.isRequired,
    //     readMore:         PropTypes.func.isRequired,
    //     handleComment:    PropTypes.func.isRequired,
    //     handleNewComment: PropTypes.func.isRequired,
    //     openCommentPanel: PropTypes.func.isRequired,
    //     handleLike:       PropTypes.func.isRequired,
    //     handleUnlike:     PropTypes.func.isRequired,
    //     handleMenuBar:    PropTypes.func.isRequired,
    //     handleImprove:    PropTypes.func.isRequired,
    //     handleHelpful:    PropTypes.func.isRequired,
    //     onCommentDelete:  PropTypes.func.isRequired,
    //     onShareClick:     PropTypes.func.isRequired,
    //     commentLoading:   PropTypes.object.isRequired
    // };

    render() {
        const { queryIdsOrdered, selectQuery, onShareClick, handleHelpful, handleImprove, onCommentDelete, viewport960px,handleComment, openCommentPanel, handleMenuBar, handleLike, handleUnlike, readMore, handleNewComment, editable, auth } = this.props;
        return (
            <div>
                { queryIdsOrdered.map((id, index) => {
                    return (
                        <QueryItem key={index}
                            onComment={() => handleComment(id) }
                            editable={editable}
                            onReadMore={() => readMore(id, selectQuery(id)) }
                            queries={selectQuery(id) }
                            handleMenuBar = {() => handleMenuBar(id) }
                            handleCommentPanel = {() => openCommentPanel(id) }
                            viewport960px={viewport960px}
                            onHelpful={(commentID, Index, helpValue, unHelpValue) => handleHelpful(id, commentID, Index, helpValue, unHelpValue) }
                            onImprove={(commentID, Index, helpValue, unHelpValue) => handleImprove(id, commentID, Index, helpValue, unHelpValue) }
                            handleCommentDelete={(commentID, Index) => onCommentDelete(id, commentID, Index)}
                            auth={auth}
                            handleShare={(text) => onShareClick(id, text)}
                            handleNewComment={(text) => handleNewComment(text, id) }
                            onPostLike={() => handleLike(id, selectQuery(id).get('likes')) }
                            onPostUnlike={() => handleUnlike(id, selectQuery(id).get('likes')) } />
                    );
                    })
                }
            </div>
        );
    }
}
