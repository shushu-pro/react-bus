export default {
  state: {
    tree: [],
  },
  reducer: {
    treeSet (prevState, payload) {
      return {
        tree: payload,
      };
    },

  },

  effect: {

  },
};
