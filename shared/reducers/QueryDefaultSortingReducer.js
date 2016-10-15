import Immutable from 'immutable';

const defaultState = Immutable.List();

export default function queryIdsOrdered(state = defaultState, action) {
    switch (action.type) {
        case 'LOAD_QUERIES':
            return Immutable.List(Object.keys(action.res.data)).reverse();
            
        case 'DELETE_QUERY':
            return state.delete(state.indexOf(action.postID));
        
        case 'LOAD_MORE_QUERIES':
            return state.concat(Object.keys(action.res.data).reverse());
        
        case 'POST_NEW_QUERY':
            return state.unshift(Object.keys(action.res.data)[0]);

        default:
            return state;
    }
}
