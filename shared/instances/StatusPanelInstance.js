import StatusPanel  from '../components/StatusPanel';

export default function StatusPanelInstance () {

  if (typeof window.StatusPanelInstance_ !== 'undefined')
    return Promise.resolve(window.StatusPanelInstance_);

  window.StatusPanelInstance_ = new StatusPanel();

  return Promise.resolve(window.StatusPanelInstance_);
}