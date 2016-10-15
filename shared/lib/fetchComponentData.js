export default function fetchComponentData(store, components, params, location) {
  const needs = components.reduce((prev, current) => {
    if (current && current.fetchData) {
      prev.push(current.fetchData);
    }
    return prev;
  }, []);
  const promises = needs.map(need => need(store.state, store.dispatch, params, location));

  return Promise.all(promises);
}
