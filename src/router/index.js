import routes from './routes'


const caches = {}

export default {

  routes () {
    !caches.routes && cacheRoutes()
    return caches.routes
  },
}

function cacheRoutes () {
  const nextRoutes = []

  cursionRoutes(routes, [])

  caches.routes = nextRoutes


  function cursionRoutes (routes, paths) {
    routes.forEach((route) => {

    })
  }
}
