import MenuBar  from '../components/MenuBar';


export default function menuInstance() {
    if (typeof window.DialogInstance_ !== 'undefined')
        return Promise.resolve(window.DialogInstance_);

    window.DialogInstance_ = new MenuBar();

    return Promise.resolve(window.DialogInstance_);
}