import React from 'react/lib/React';
import Helpful from './Helpful';
import StatusCard from './StatusCard';
import LazyLoad from 'react-lazyload/lib/index';

const PostDetailView = ({ auth, post, onHelpful, onImprove, handleShare, onPostLike, onReadMore, onPostUnlike, handleMenuBar, onCommentDelete, onSetFocus }) => {
    const styles = require('../../scss/master.scss');

    return (
        <div >
            <StatusCard posts={post} auth={auth} openMenuBar={handleMenuBar} onReadMore={onReadMore} />
            <h4></h4>
            <div className="mdl-share-tabs">
                <div className="mdl-share-tabs-bar-detailview">
                    <div className="col_xs_4">
                        {post.get('liked') === null ? <span onClick={onPostLike} className="mdl-share-tabs__tab">Like</span> :
                            <span onClick={onPostUnlike} className="mdl-share-tabs__tab">Unlike</span> }
                    </div>
                    <div className="col_xs_4">
                        <span className="mdl-share-tabs__tab" onClick={onSetFocus}>Comment</span>
                    </div>
                    <div className="col_xs_4">
                        <span onClick={() => handleShare(post.get('Status_Value'))} className="mdl-share-tabs__tab">Share</span>
                    </div>
                </div>
            </div>
            { post.get('Total_Comments') > 0 ? <h4 className={styles.commentText}>Comments</h4> : <h5> Be the first one to comment...</h5> }
            <div className="list-view__margin">
                {post.get('comments').map((value, index) => {
                    return (
                        <div key={index} className="list-view__item">
                            <div className="col_xs_2">
                            <LazyLoad height={0} throttle={200} once>
                                <img src={value.get('ProfilePic') === null || '' ? '/timeline/images/blank.png' : '/' + value.get('ProfilePic')} className={styles.detailed_imageName} width="45" height="45" />
                            </LazyLoad>
                            </div>
                            
                            <div className="col_xs_10">
                                <span className={styles.time_ago}>{value.get('Time_Ago')}</span>
                                <div className={styles.detailed_authorName}>{value.get('Fname') + ' ' + value.get('Lname') }</div>
                                <div className={styles.detailed_subdetails}>
                                    {value.get('Designation') === null || ' ' ? '' : value.get('Designation') + ', '}
                                    {value.get('Organization') === null || '' ? '' : value.get('Organization') }
                                </div>
                                <div className={styles.detailed_comment}>{value.get('Comment_Value') }</div>
                                { value.get('Comment_Creator') !== auth.get('id') ?
                                <Helpful value={value} index={index} onHelpful={onHelpful} onImprove={onImprove} />
                                :  
                                <button onClick={() => onCommentDelete(value.get('id'), index)} className={styles.mdl_helpful_button}>
                                    <img src="/images/garbage.png" />
                                    <span> Delete </span>
                                </button>}
                            </div>
                        </div>
                    )
                }) }
            </div>
        </div>
    )
}

export default PostDetailView;