import React from 'react/lib/React';

export default function () {
    const styles = require('../../scss/loader.scss');
    const css = require('../../scss/master.scss');
    return (
     <div className={styles.timelineWrapper}>
        <div className={styles.timelineItem}>
            <div className="col_xs_1">
                <img src="" width="45" height="45" className={css.detailed_imageName}/>
            </div>
            <div className="col_xs_6">
                <div className={styles.animatedBackground}>
                </div>
                <div className={styles.animatedBackground}>
                </div>
            </div>
            <div className="col_xs_12">
                <hr />
            </div>
            <div className="col_xs_12">
                <div className="col_xs_10">
                    <div className={styles.animatedBackground}>
                    </div>
                </div>
                <div className="col_xs_4">
                    <div className={styles.animatedBackground}>
                    </div>
                </div>
                <div className="col_xs_8">
                    <div className={styles.animatedBackground}>
                    </div>
                </div>
                <div className="col_xs_10">
                <div className={styles.animatedBackground}>
                </div>
                </div>
           </div>
        </div>
    </div>
    );
}