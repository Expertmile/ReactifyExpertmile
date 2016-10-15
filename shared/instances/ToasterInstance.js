import Toaster from '../components/Toaster';

export default function toasterInstance() {
    if(typeof ToasterInstance_ !== 'undefined') {
        return Promise.resolve(window.ToasterInstance_);
    }
        window.ToasterInstance_ = new Toaster();

    return Promise.resolve(window.ToasterInstance_);
}