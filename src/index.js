
import main from './main'

main()

// Webpack Hot Module Replacement API
if (module.hot) {
  module.hot.accept('./main', () => {
    main()
  })
}
