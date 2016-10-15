import Immutable from 'immutable';

const defaultState = Immutable.Map({ articles: {}, assignments: {} });

export default function profile(state = defaultState, action) {
	switch(action.type){
		case 'GET_ARTICLES_DATA':
			return state.set('articles', Immutable.fromJS(action.res.data));
		case 'GET_ASSIGNMENT_DATA':
			return state.set('assignments', Immutable.fromJS(action.res.data));
		default:
			return state;
	}
}