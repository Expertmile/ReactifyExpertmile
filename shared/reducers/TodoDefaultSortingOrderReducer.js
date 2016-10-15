import Immutable from 'immutable';

const defaultState = Immutable.List();

export default function todoIdsOrdered(state = defaultState, action) {
  switch (action.type) {
    case 'LOAD_STATUS':
      return Immutable.List(Object.keys(action.res.data)).reverse();

    case 'DELETE_TODO':
      return state.delete(state.indexOf(action.id));
    
    case 'DELETE_STATUS':
			return state.delete(state.indexOf(action.postID));
      
    case 'LOAD_MORE_STATUS':
      return state.concat(Object.keys(action.res.data).reverse());
    
    case 'POST_NEW_STATUS':
      return state.unshift(Object.keys(action.res.data)[0]);

    default:
      return state;
  }
}
