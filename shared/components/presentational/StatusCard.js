import React from 'react/lib/React';
import LazyLoad from 'react-lazyload/lib/index';

const StatusCard = ({ auth, posts, onReadMore, openMenuBar, handleShare, onComment, onLike, onDislike }) => {
    const styles = require('../../scss/master.scss');
    
    return (
        <div>
        <div className={styles.imagecontainer}>
            <LazyLoad height={0} throttle={200} once>
                <img src={posts.get('ProfilePic') === null || '' ? '/timeline/images/blank.png' : '/' + posts.get('ProfilePic')} className={styles.detailed_imageName} width="45" height="45" />
            </LazyLoad>
            <span className={styles.nameblock}>{posts.get('category') !== 'normal'? 
            <a href={'https://expertmile.com/newview.php?profID=' + posts.get('ID')}>{posts.get('Fname') + ' ' + posts.get('Lname') }</a>
            : posts.get('Fname') + ' ' + posts.get('Lname') }</span>
            <span className={styles.subdetails}>
                {posts.get('Designation') === null || ' ' ? '' : posts.get('Designation') + ', '}
                {posts.get('Organization') === null || '' ? '' : posts.get('Organization') }
            </span>
        
            { auth.get('id') === posts.get('Status_Creator') ?
                <div onClick={openMenuBar} className={styles.detect_click}><i className={styles.icono_tiles}></i></div>
                : <span className={styles.time_ago}>{posts.get('Time_Ago')}</span> }
        </div>
        <hr className={styles.hr} />  
            <h6 className={styles.postcontent}>
                <span>{posts.get('Short_Status')}</span>
                { posts.get('Status_Length') > 200 ? <span className={styles.text_info} onClick={onReadMore}><b> ...Read More</b></span> : '' }
            </h6>
            <div className="hidden_sm hidden_xs hidden_md">
                <div className={styles.desk_tab_margin}>
                    { posts.get('liked') === null ? 
                    <button onClick={onLike} className={styles.mdl_helpful_button_fill}>
                    <div  height={0} once>
                        <img src="/timeline/images/likeme.png" width="24" height="24" />
                    </div>
                        <span> Like | {posts.get('likes')}</span>
                    </button> : 
                    <button onClick={onDislike} className={styles.mdl_helpful_button_fill}>
                    <div height={0} once>
                        <img src="/timeline/images/liked.png" width="24" height="24" />
                    </div>
                        <span> Like | {posts.get('likes')}</span>
                    </button> }

                    {posts.get('Total_Comments') > 1 ?
                    <button onClick={onComment} className={styles.mdl_helpful_button_fill}>
                    <div height={0} once>
                        <img src="/timeline/images/chats.png" width="24" height="24" /> 
                    </div>
                        <span> Comments | {posts.get('Total_Comments')}</span>
                    </button> :
                    null }
                    <button onClick={handleShare} className={styles.mdl_helpful_button_fill}>
                    <div  height={0} once>
                        <img src="/timeline/images/next.png" width="24" height="24" />
                    </div>
                        <span> Share </span>
                    </button>
                </div>
            </div>
            <div className="hidden_lg">
                <div className={styles.comment_value}>
                    { posts.get('likes') }
                    <span>{ posts.get('likes') == 1 ? ' like' : ' likes'} </span>
                    { posts.get('Total_Comments') > 0 ? ' | ' + posts.get('Total_Comments') : null }
                    { posts.get('Total_Comments') > 0 ? <span>{ posts.get('Total_Comments') == 1 ? ' comment' : ' comments'} </span> : null}
                </div>
            </div>
        </div>
    )
}

export default StatusCard;