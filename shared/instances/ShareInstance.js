import Share       from '../components/Share';

export default function shareInstance() {
    if(window.ShareInstance_ !== 'undefined') {
        return Promise.resolve(window.ShareInstance_)
    }
    window.ShareInstance_ = new Share();
    return Promise.resolve(window.ShareInstance_);
}; 
