import Immutable from 'immutable';

const defaultState = Immutable.List();

export default function articleDetailIdsOrdered(state = defaultState, action) {
    switch (action.type) {
        case 'LOAD_DETAILED_ARTICLE':
            return Immutable.List(Object.keys(action.res.data)).reverse();
        case 'LOAD_MORE_DETAILED_ARTICLE':
            return state.concat(Object.keys(action.res.data).reverse());
        default:
            return state;
    }
}