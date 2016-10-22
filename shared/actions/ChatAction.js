export const loadAuth = () => ({
  type:    'LOAD_AUTH',
  promise: client => client.post('/loadAuth')
});

export const LoadChat = () => ({
    type:    'LOAD_CHAT',
    role:    'primary',
    promise: client => client.get('/ChatUsers/')
});

export const loadMore = (page) => ({
    type:    'LOAD_MORE_ARTICLES',
    role:    'primary',
    promise: client => client.get('/articles/list/'+ page)
});

export const loadDetailedArticle = (artiID, page) => ({
    type:    'LOAD_DETAILED_ARTICLE',
    role:    'primary',
    promise: client => client.get('/article/detail/'+ artiID + '/' + page)
});

export const loadMoreDetailedArticle = (page) => ({
    type:    'LOAD_MORE_DETAILED_ARTICLE',
    role:    'primary',
    promise: client => client.get('/article/detail/' + page)
});

export const postNewComment = (comment, auth, artiID) => ({
    type:    'POST_NEW_COMMENT',
    promise: client => client.post('/article/detail/comment', {comment, auth, artiID}),
    artiID
});