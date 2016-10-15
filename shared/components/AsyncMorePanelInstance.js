import LoadAsync from '../components/LoadAsync';

export default function asyncMorePanelInstance() {
    if (typeof window.AsyncMoreInstance_ !== 'undefined') {
        return Promise.resolve(window.AsyncMoreInstance_);
    }
    window.AsyncMoreInstance_ = new LoadAsync();
    return Promise.resolve(window.AsyncMoreInstance_);
} 