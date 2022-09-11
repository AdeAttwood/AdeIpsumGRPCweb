const config = require("./scripts/webpack.config");
const server = require("./scripts/webpack.server");

const input = "src";
const output = "public";

module.exports = config({ input, output });
module.exports.devServer = server({ input, output });
