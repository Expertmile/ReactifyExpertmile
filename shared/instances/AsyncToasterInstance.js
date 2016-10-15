import LoadAsync from '../components/LoadAsync';

export default function asyncToasterInstance() {
    if(typeof window.AsyncToasterInstance_ !== 'undefined') {
        return Promise.resolve(window.AsyncToasterInstance_);
    }
        window.AsyncToasterInstance_ = new LoadAsync();
    return Promise.resolve(window.AsyncToasterInstance_);
}