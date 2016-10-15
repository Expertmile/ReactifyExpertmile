import Immutable from 'immutable';

const defaultState = Immutable.List();

export default function articleIdsOrdered(state = defaultState, action) {
    switch (action.type) {
        case 'LOAD_ARTICLES':
            return Immutable.List(Object.keys(action.res.data)).reverse();
        case 'LOAD_MORE_ARTICLES':
            return state.concat(Object.keys(action.res.data).reverse());
        default:
            return state;
    }
}