import LoadAsync from '../components/LoadAsync';

export default function asyncSideBarInstance() {
    if (typeof window.AsyncSideBarInstance_ !== 'undefined') {
        return Promise.resolve(window.AsyncSideBarInstance_);
    }
    window.AsyncSideBarInstance_ = new LoadAsync();
    return Promise.resolve(window.AsyncSideBarInstance_);
}