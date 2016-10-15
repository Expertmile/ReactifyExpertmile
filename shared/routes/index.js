import React  from 'react/lib/React';
import Route from 'react-router/lib/Route'
import App  from '../components/App';
// polyfill webpack require.ensure
if (typeof require.ensure !== 'function') require.ensure = (d, c) => c(require)

export default () => {
  const base = '/';
  return (
    <Route component={App}>
      <Route path={base}  getComponent = { (nextState, cb) => {
          require.ensure([], (require) => {
            cb(null, require('../components/Main').default)
          })
        } }> 
        <Route path="post/:id" getComponent = { (nextState, cb) => {
          require.ensure([], (require) => {
            cb(null, require('../components/PostDetailPanel').default)
          })
        } } />
        <Route path="more" getComponent = { (nextState, cb) => {
          require.ensure([], (require) => {
            cb(null, require('../components/MoreRoute').default)
          })
        }} />  
        <Route path="create/:id" getComponent = { (nextState, cb) => {
          require.ensure([], (require) => {
            cb(null, require('../components/StatusPanel').default)
          })
        } } />
      </Route>
      <Route path="/articles/list" getComponent = { (nextState, cb) => {
        require.ensure([], (require) => {
          cb(null, require('../components/ArticleMain').default)
        })
      } }>
          <Route path="query/:id" getComponent = { (nextState, cb) => {
            require.ensure([], (require) => {
              cb(null, require('../components/QueryDetailPanel').default)
            })
          } } /> 
      </Route>

       <Route path="/article/:id/:name" getComponent = { (nextState, cb) => {
          require.ensure([], (require) => {
            cb(null, require('../components/ArticleDetail.js').default)
          })
        } } />
        
    </Route>
  )
}