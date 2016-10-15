export const loadAuth = () => ({
  type:    'LOAD_AUTH',
  promise: client => client.get('https://expertmile.com/fb0d7bb8b66cf7c4d00bad23656ff384.php')
});

export const loadQueries = (sessionID) => ({
    type:    'LOAD_QUERIES',
    role:    'primary',
    promise: client => client.get('/queries/' + sessionID)
});

export const loadMoreQueries = (page, authorID) => ({
  type:    'LOAD_MORE_QUERIES',
  role:    'primary',
  promise: client => client.get('/queries/' + page + '/' + authorID)
});

export const getDetailedPost = (postID, authID) => ({
    type:    'LOAD_DETAILED_QUERY',
    promise: client => client.get('/post/detail/' + postID + '/' + authID)
});


export const readMore = (id, text) => ({
  type: 'READ_MORE_QUERIES',
  id, text
});

export const handleLike = (id, currentValue, authID) => ({ 
  type:    'LIKE_QUERY',
  promise: client => client.post('/post/like/', { id, currentValue, authID }),
  id, currentValue
});

export const handleUnlike = (id, currentValue, authID) => ({
  type:    'UNLIKE_QUERY',
  promise: client => client.post('/post/unlike/', { id, currentValue, authID }),
  id, currentValue
});

export const handleHelpful = (postID, commentID, Index, helpValue, unHelpValue, authID) => ({ 
  type:    'SET_HELPFUL_QUERY',
  promise: client => client.post('/comment/helpful/', { commentID, authID }),
  postID, Index, helpValue, unHelpValue
});

export const handleImprove = (postID, commentID, Index, helpValue, unHelpValue, authID) => ({ 
  type:    'SET_IMPROVE_QUERY',
  promise: client => client.post('/comment/improve/', { commentID, authID }),
  postID, Index, helpValue, unHelpValue
}); 

export const hideFabButton = (pos) => ({
  type: 'HIDE_FAB_QUERY',
  pos
});

export const showFabButton = (pos) => ({
  type: 'SHOW_FAB_QUERY',
  pos
});

export const handleStatus = (post) => ({
  type: 'CHANGE_STATUS_VALUE_QUERY',
  post
});

export const postStatus = (id, post, category) => ({
  type:    'POST_NEW_QUERY',
  promise: client => client.post('/addStatus/', { id, post, category })
});

export const editStatus = (postID, post) => ({
  type:    'EDIT_QUERY',
  promise: client => client.post('/editStatus/', { postID, post }),
  postID, post
});

export const handleDeletePost = (postID) => ({
  type:    'DELETE_QUERY',
  promise: client => client.post('/deleteStatus/', { postID }),
  postID
})

export const loadComments = (postID, authID) => ({
    type:    'LOAD_COMMENT_QUERY',
    promise: client => client.get('/comments/' + authID + '/' + postID),
    postID
});

export const unloadComments = (postID) => ({
    type: 'UNLOAD_COMMENT_QUERY',
    postID
});

export const handleComment = (comment) => ({
  type: 'CHANGE_COMMENT_VALUE_QUERY',
  comment
});

export const handleCommentDelete = (postID, commentID, index) => ({
  type:    'DELETE_COMMENT_QUERY',
  promise: client => client.post('/comment/delete/', { postID, commentID }),
  postID, commentID, index
});

export const addComment = (text, id, creator) => ({
  type:    'ADD_COMMENT_QUERY',
  promise: client => client.post('/addComment/', { text, id, creator }),
  id, text
});
