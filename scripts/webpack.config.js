const path = require("path");
const fs = require("fs");
const { WebpackManifestPlugin } = require("webpack-manifest-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const RemoveEmptyScriptsPlugin = require("webpack-remove-empty-scripts");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const isProduction = process.env.NODE_ENV === "production";

const jsName = isProduction ? "js/[name].[chunkhash:8].js" : "js/[name].js";
const cssName = isProduction ? "css/[name].[chunkhash:8].css" : "css/[name].css";

/**
 * @param root {String}
 */
function buildEntryPoints(root) {
  const files = fs.readdirSync(root);
  return files
    .filter((file) => file.match(/\.(jsx?|s[ac]ss)$/))
    .reduce((result, file) => {
      return {
        ...result,
        [file.replace(/\..*$/, "")]: `./${file}`,
      };
    }, {});
}

module.exports = function ({ input, output, cwd }) {
  const context = path.resolve(cwd || process.cwd(), input);
  const entry = buildEntryPoints(context);

  return {
    mode: isProduction ? "production" : "development",
    context,
    entry,
    output: {
      filename: jsName,
      chunkFilename: jsName,
      path: path.resolve(cwd || process.cwd(), output, "assets"),
      publicPath: "/assets/",
    },
    resolve: {
      extensions: [".js", ".jsx", ".mjs", ".sass", ".css"],
      alias: {
        "@": context,
      },
    },
    devtool: isProduction ? false : "source-map",
    watchOptions: { ignored: /node_modules/, poll: true },
    optimization: {
      splitChunks: {
        // include all types of chunks
        chunks: "all",
      },
    },
    plugins: [
      new RemoveEmptyScriptsPlugin(),
      new MiniCssExtractPlugin({
        filename: cssName,
        chunkFilename: cssName,
      }),
      new WebpackManifestPlugin({
        fileName: "asset-manifest.json",
      }),
      // Create a manifest file for each of the entrypoints. This can be used
      // to import the assets in server side frameworks when the filenames have
      // been hashed.
      ...Object.keys(entry).map((name) => {
        return new WebpackManifestPlugin({
          fileName: `asset-manifest-required-${name}.json`,
          filter: (file) => {
            // We only want to include assests that have chunks and that are
            // initial files
            if (typeof file.chunk === "undefined" || !file.isInitial) {
              return false;
            }

            return typeof file.chunk.runtime === "string" ? file.chunk.runtime === name : file.chunk.runtime.has(name);
          },
        });
      }),
      // Generate a html file for each of the entrypoints and limit the chunks
      // to that entry point.
      ...Object.keys(entry).map((name) => {
        return new HtmlWebpackPlugin({
          template: path.resolve(cwd || process.cwd(), input, `index.html`),
          filename: path.resolve(cwd || process.cwd(), output, `${name}.html`),
          chunks: [name],
        });
      }),
    ],
    module: {
      rules: [
        {
          test: /\.[cm]?jsx?$/,
          exclude: /(node_modules)/,
          use: { loader: "babel-loader" },
        },
        {
          test: /\.(s[ac]ss|css)$/i,
          use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
        },
      ],
    },
  };
};
