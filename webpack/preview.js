const path = require('path');

module.exports = {
  devServer: {
    contentBase: [ 'dist', 'cdn' ].map((folder) => path.join(process.cwd(), folder)),
    open: true,
  },
};
