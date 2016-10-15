import LoadAsync from '../components/LoadAsync';

export default function asyncHomeInstance() {
    if (typeof window.AsyncHomeInstance_ !== 'undefined') {
        return Promise.resolve(window.AsyncHomeInstance_);
    }
    window.AsyncHomeInstance_ = new LoadAsync();
    return Promise.resolve(window.AsyncHomeInstance_);
}