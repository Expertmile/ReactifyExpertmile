export const loadAuth = () => {
  return {
    type:    'LOAD_AUTH',
    promise: client => client.post('/loadAuth')
  }
};

export const loadPosts = (sessionID) => ({
    type:    'LOAD_STATUS',
    role:    'primary',
    promise: client => client.get('/posts/' + sessionID)
});

export const loadMore = (page, authorID) => ({
  type:    'LOAD_MORE_STATUS',
  role:    'primary',
  promise: client => client.get('/posts/' + page + '/' + authorID)
});

export const getDetailedPost = (postID, authID) => ({
    type:    'LOAD_DETAILED_POST',
    promise: client => client.get('/post/detail/' + postID + '/' + authID)
});

export const readMore = (id, text) => ({
  type: 'READ_MORE',
  id, text
});

export const handleLike = (id, currentValue, authID) => ({ 
  type:    'LIKE_POST',
  promise: client => client.post('/post/like/', { id, currentValue, authID }),
  id, currentValue
});

export const handleUnlike = (id, currentValue, authID) => ({
  type:    'UNLIKE_POST',
  promise: client => client.post('/post/unlike/', { id, currentValue, authID }),
  id, currentValue
});

export const handleHelpful = (postID, commentID, Index, helpValue, unHelpValue, authID) => ({ 
  type:    'SET_HELPFUL',
  promise: client => client.post('/comment/helpful/', { commentID, authID }),
  postID, Index, helpValue, unHelpValue
});

export const handleImprove = (postID, commentID, Index, helpValue, unHelpValue, authID) => ({ 
  type:    'SET_IMPROVE',
  promise: client => client.post('/comment/improve/', { commentID, authID }),
  postID, Index, helpValue, unHelpValue
}); 

export const hideFabButton = (pos) => {
  return {
    type: 'HIDE_FAB',
    pos
  }
};

export const showFabButton = (pos) => {
  return {
    type: 'SHOW_FAB',
    pos
  }
}
  

export const handleStatus = (post) => ({
  type: 'CHANGE_STATUS_VALUE',
  post
});

export const postStatus = (id, post, category) => ({
  type:    'POST_NEW_STATUS',
  promise: client => client.post('/addStatus/', { id, post, category })
});

export const editStatus = (postID, post) => ({
  type:    'EDIT_STATUS',
  promise: client => client.post('/editStatus/', { postID, post }),
  postID, post
});

export const handleDeletePost = (postID) => ({
  type:    'DELETE_STATUS',
  promise: client => client.post('/deleteStatus/', { postID }),
  postID
})

export const loadComments = (postID, authID) => ({
    type:    'LOAD_COMMENT',
    promise: client => client.get('/comments/' + authID + '/' + postID),
    postID
});

export const unloadComments = (postID) => ({
    type: 'UNLOAD_COMMENT',
    postID
});

export const handleComment = (comment) => ({
  type: 'CHANGE_COMMENT_VALUE',
  comment
});

export const handleCommentDelete = (postID, commentID, index) => ({
  type:    'DELETE_COMMENT',
  promise: client => client.post('/comment/delete/', { postID, commentID }),
  postID, commentID, index
});

export const addComment = (text, id, creator) => ({
  type:    'ADD_COMMENT',
  promise: client => client.post('/addComment/', { text, id, creator }),
  id, text
});

export const sendNotification = (author, authorID, postID, authID ) => ({
    type:    'SEND_NOTIFICATION',
    promise: client => client.post('/notification/', { author, authorID, postID, authID })
});

export const setNotificationData = (postID, author, name, picture ) => ({
    type:    'SET_NOTIFICATION_DATA',
    promise: client => client.post('/pushData/', { author, name }),
    postID, author, name, picture
});

export const resetNotificationData = () => ({
    type: 'RESET_NOTIFICATION_DATA'
});  
