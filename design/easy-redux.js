// easy-redux 设计
const app = {
  state: {
    pageSize: 10,
    bookList: [],
  },

  reducer: {
    setBookList (nextBookList) {
      return {
        bookList: nextBookList.filter((book) => book.isOnsale),
      }
    },
  },

  effect: {
    async updateBookList (payload, reducer) {
      const nextBookList = await api.getBookList()
      reducer.setPageSize(payload.pageSize)
      reducer.setBookList(nextBookList)
    },
  },
}

// import app from './app'
createStore({
  app,
})

function Component (props) {
  props.dispatch('app.setPageSize', 20)
  props.updateBookList({ pageSize: 12 })
}

connect(
  ({ app }) => ({
    pageSize: app.pageSize,
    bookList: app.bookList,
  }),
  ({ app }) => ({
    updateBookList: app.updateBookList,
  })
)(Component)

pageState.createStore({
  mod1: {
    setName () {},
  },
  mod2: {

  },
})

pageState.connect()


pageState.connect(mapStateToProps, mapDispatchToProps)(Component)

props.dispatch('mod1.setName', 'xxxx')
