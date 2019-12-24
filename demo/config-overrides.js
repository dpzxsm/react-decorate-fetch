const {
  override,
  disableEsLint,
  addBabelPlugin
} = require('customize-cra');

const findWebpackPlugin = (plugins, pluginName) =>
  plugins.find(plugin => plugin.constructor.name === pluginName);

const overrideProcessEnv = value => config => {
  const plugin = findWebpackPlugin(config.plugins, 'DefinePlugin');
  const processEnv = plugin.definitions['process.env'] || {};

  plugin.definitions['process.env'] = {
    ...processEnv,
    ...value,
  };

  return config;
};


module.exports = override(
  disableEsLint(),
  addBabelPlugin(["@babel/plugin-proposal-decorators", { "legacy": true }]),
  overrideProcessEnv({
    HOST: `"${process.env.SUMING_HOST}"`
  })
);
