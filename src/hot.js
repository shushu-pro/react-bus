import render from './index';

render();

// Webpack Hot Module Replacement API
if (module.hot) {
  // module.hot.accept()
  module.hot.accept('./index', () => {
    try {
      render();
    } catch (e) {
      console.error(e);
    }
  });
}
