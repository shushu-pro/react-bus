import render from './src/index'

// Webpack Hot Module Replacement API
if (module.hot) {
  module.hot.accept('./src/index', () => {
    render()
  })
}

render()