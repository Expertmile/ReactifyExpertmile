import LoadAsync from '../components/LoadAsync';

export default function asyncDialogInstance() {
    if (typeof window.AsyncDialogInstance_ !== 'undefined') {
        return Promise.resolve(window.AsyncDialogInstance_);
    }
    window.AsyncDialogInstance_ = new LoadAsync();
    return Promise.resolve(window.AsyncDialogInstance_);
}