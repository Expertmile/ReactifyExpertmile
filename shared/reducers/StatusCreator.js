import Immutable from 'immutable';

const defaultState = Immutable.Map({ html: '' });

export default function statusCreator(state = defaultState, action) {
    switch (action.type) {
        case 'CHANGE_STATUS_VALUE':
            return state.set('html', action.post);

        case 'CHANGE_COMMENT_VALUE':
            return state.set('html', action.comment);

        default:
            return state;
    }
}