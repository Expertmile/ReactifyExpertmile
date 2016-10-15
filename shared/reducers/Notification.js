import Immutable from 'immutable';

const defaultState = Immutable.Map({ postID: 0, author: false, senderName: null, picture: null});

export default function notification(state=defaultState, action) {
    switch(action.type) {
        case 'SET_NOTIFICATION_DATA':
            return state.merge({ postID: action.postID, author: action.author, senderName: action.name, picture: action.picture }); 
        case 'RESET_NOTIFICATION_DATA':
			return state.merge({ postID: 0, author: false, senderName: null, picture: null});
        default:
            return state;
    }
}