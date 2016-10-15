import Immutable from 'immutable';
import { isAuthenticated, isUserID }    from '../reducers/AuthReducer';

const defaultState = Immutable.Map();

export default function posts(state = defaultState, action) {
	switch (action.type) {
		case 'LOAD_STATUS':
			return Immutable.fromJS(action.res.data);

		case 'LOAD_DETAILED_POST':
			return Immutable.fromJS(action.res.data);

		case 'READ_MORE':
			const statusChange = action.text.set('Short_Status', action.text.get('Status_Value'));
			const newState = statusChange.set('Status_Length', 0);
			return state.set(action.id, newState);
		
		case 'EDIT_STATUS':
			return state.updateIn([action.postID], val => val.set('Short_Status', action.post).set('Status_Length', 0));

		case 'DELETE_STATUS':
			return state.delete(action.postID);

		case 'LOAD_MORE_STATUS':
			return state.merge(action.res.data);

		case 'LOAD_COMMENT':
			return state.updateIn([action.postID, 'comments'], val => val.merge(action.res.data));

		case 'UNLOAD_COMMENT':
			return state.updateIn([action.postID, 'comments'], val => val.take(1));
		
		case 'DELETE_COMMENT':
			return state
					.updateIn([action.postID, 'comments'], val => val.delete(action.index))
					.updateIn([action.postID], val => val.set('Total_Comments', val.get('Total_Comments') - 1));

		case 'ADD_COMMENT':
			return state
					.updateIn([action.id, 'comments'], val => val.insert(val.size, Immutable.fromJS(action.res.data[0])))
					.updateIn([action.id], val => val.set('Total_Comments', val.get('Total_Comments') + 1));

		case 'POST_NEW_STATUS':
			return state.merge(action.res.data);

		// Like and unlike logic

		case 'LIKE_POST_REQUEST':
			return state.updateIn([action.id], value => value.set('likes', action.currentValue + 1).set('liked', action.id));

		case 'LIKE_POST':
			return state;

		case 'LIKE_POST_FAILURE':
			return state.updateIn([action.id], value => value.set('likes', action.currentValue).set('liked', null));

		case 'UNLIKE_POST_REQUEST':
			return state.updateIn([action.id], value => value.set('likes', action.currentValue - 1).set('liked', null));

		case 'UNLIKE_POST':
			return state;

		case 'UNLIKE_POST_FAILURE':
			return state.updateIn([action.id], value => value.set('likes', action.currentValue).set('liked', action.id));

		// helpful  logic

		case 'SET_HELPFUL_REQUEST':
			return state.updateIn([action.postID, 'comments', action.Index], value => {
				if (action.unHelpValue !== 0) {
					return value.set('helpfuluser', 1).set('helpful', action.helpValue + 1).set('nothelpful', action.unHelpValue - 1);
				} else {
					return value.set('helpfuluser', 1).set('helpful', action.helpValue + 1);
				}
			});

		case 'SET_HELPFUL':
			return state;

		case 'SET_HELPFUL_FAILURE':
			return state.updateIn([action.postID, 'comments', action.Index], value => {
				if (action.unHelpValue !== 0) {
					return value.set('helpfuluser', 2).set('helpful', action.helpValue).set('nothelpful', action.unHelpValue);
				} else {
					return value.set('helpfuluser', 2).set('helpful', action.helpValue);
				}
			});

		// unhelpful logic

		case 'SET_IMPROVE_REQUEST':
			return state.updateIn([action.postID, 'comments', action.Index], value => {
				if (action.helpValue !== 0) {
					return value.set('helpfuluser', 2).set('nothelpful', action.unHelpValue + 1).set('helpful', action.helpValue - 1);
				} else {
					return value.set('helpfuluser', 2).set('nothelpful', action.unHelpValue + 1);
				}
			});

		case 'SET_IMPROVE':
			return state;

		case 'SET_IMPROVE_FAILURE':
			return state.updateIn([action.postID, 'comments', action.Index], value => {
				if (action.helpValue !== 0) {
					return value.set('helpfuluser', 1).set('nothelpful', action.unHelpValue + 1).set('helpful', action.helpValue - 1);
				} else {
					return value.set('helpfuluser', 1).set('nothelpful', action.unHelpValue + 1);
				}
			});

		default:
			return state;
	}
}

export const isEditable = (state) => isAuthenticated(state);
export const canChange = (state) => isUserID(state);
export const selectPost = (state, id) => state.posts.get(id);