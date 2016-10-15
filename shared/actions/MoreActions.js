export const loadArticles = (id) => ({
    type:    'GET_ARTICLES_DATA',
    role:    'primary',
    promise: client => client.get('/myarticles/' + id)
});

export const loadAuth = () => ({
  type:    'LOAD_AUTH',
  promise: client => client.get('https://expertmile.com/fb0d7bb8b66cf7c4d00bad23656ff384.php')
});

export const resetAuth = () => ({
  type: 'RESET_AUTH'
});

export const loadAssignments = () => ({
  type:    'GET_ASSIGNMENT_DATA',
  promise: client => client.get('/newassignments/')
})


