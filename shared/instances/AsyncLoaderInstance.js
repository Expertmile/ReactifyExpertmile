import LoadAsync from '../components/LoadAsync';

export default function asyncLoaderInstance() {
    if (typeof window.AsyncLoaderInstance_ !== 'undefined') {
        return Promise.resolve(window.AsyncLoaderInstance_);
    }
    window.AsyncLoaderInstance_ = new LoadAsync();
    return Promise.resolve(window.AsyncLoaderInstance_);
} 