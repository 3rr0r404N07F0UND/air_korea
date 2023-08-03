const path = require("path");

module.exports = {
  mode: "development",
  entry: {
    main: "./static/main.js",
  },
  output: {
    filename: "[name].js",
    path: path.resolve("./static/dist"),
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_module/,
        use: {
          loadder: "babel-loader",
        },
      },
    ],
  },
};
