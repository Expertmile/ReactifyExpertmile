import React, {PropTypes} 			from 'react/lib/React';
import ImmutablePropTypes         from 'react-immutable-proptypes';
import InputComment  	from './InputComment';
import StatusCard 		from './StatusCard';
import CommentView 		from './CommentView';

export default class QueryItem extends React.Component {
	constructor(props) {
		super(props);
		this.state = { html: '' };
	}
	
	static propTypes = {
		queries:             ImmutablePropTypes.map.isRequired,
		auth:                ImmutablePropTypes.map.isRequired,
		onReadMore:          PropTypes.func.isRequired,
		onComment:           PropTypes.func.isRequired,
		onPostLike:          PropTypes.func.isRequired,
		handleNewComment:    PropTypes.func.isRequired,
		onPostUnlike:        PropTypes.func.isRequired,
		handleMenuBar:       PropTypes.func.isRequired,
		handleCommentPanel:  PropTypes.func.isRequired,
		handleCommentDelete: PropTypes.func.isRequired,
		onImprove: 	         PropTypes.func.isRequired,
		onHelpful: 	         PropTypes.func.isRequired,
		editable:            PropTypes.bool.isRequired,
		handleShare:         PropTypes.func.isRequired
  };

	handleChange = (event) => { 
		this.setState({ html: event });
	}

	handleSubmit = () => {
		this.props.handleNewComment(this.state.html);
		this.setState({ html: '' });
	}

	render() {
		const {queries, auth, onReadMore, onComment, handleShare, viewport960px, handleCommentDelete, onImprove, onHelpful, editable, onPostLike, onPostUnlike, handleMenuBar, handleCommentPanel } = this.props;
		const styles = require('../../scss/master.scss');

		return (
			<div>
				<div className={styles.timeline_card}>
					<div className={styles.card_body}>
						<StatusCard
							auth={auth}
							posts={queries}
							handleShare={handleShare}
							onReadMore={onReadMore}
							openMenuBar={handleMenuBar}
							onComment={onComment}
							viewport960px={viewport960px}
							onLike={onPostLike}
							onDislike={onPostUnlike} />
					</div>
				</div>

				<div className="hidden_lg hidden_md">
					<div className={styles.tabs_card}>
						<div className="mdl-share-tabs">
							<div className="mdl-share-tabs-bar">
								<div className="col_xs_4">
									{queries.get('liked') === null ? <span onClick={onPostLike} className="mdl-share-tabs__tab">Like</span> :
										<span onClick={onPostUnlike} className="mdl-share-tabs__tab">Unlike</span> }
								</div>
								<div className="col_xs_4">
									<span onClick={handleCommentPanel} className="mdl-share-tabs__tab">Comment</span>
								</div>
								<div className="col_xs_4">
									<span onClick={() => handleShare(queries.get('Status_Value'))} className="mdl-share-tabs__tab">Share</span>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div>
				{queries.get('comments').map((cid, index) => {
					return (
						<div key={index}>
							<div className={styles.comment_card}>
								<div className={styles.card_body_comment}>
									<CommentView 
										value={cid} 
										auth={auth}
										onImprove={onImprove} 
										onHelpful={onHelpful} 
										index={index}
										onCommentDelete={handleCommentDelete}
										viewport960px={viewport960px} />
								</div>
							</div>
						</div>
					)
				}) }
				<div className="hidden_xs hidden_sm">
					{ editable ? <div className={styles.comment_card}>
						<div className={styles.card_body_comment}>
							<InputComment
								html={this.state.html}
								onChange={this.handleChange}
								onSubmit={this.handleSubmit} />
						</div>
					</div> : null }
				</div>
				</div>
			</div>
		);
	}
}

