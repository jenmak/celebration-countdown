const { createRequire } = require('node:module')

/**
 * `babel-preset-expo` only registers the expo-router plugin when it can resolve
 * `expo-router` from its own location. In this workspace npm hoists the preset to
 * the repo root while `expo-router` stays under `apps/mobile`, so the plugin gets
 * skipped and `require.context(process.env.EXPO_ROUTER_APP_ROOT)` is never inlined.
 * Register it here whenever the preset's own lookup would miss it.
 */
function routerPluginIfPresetCannotSeeIt() {
  const presetRequire = createRequire(require.resolve('babel-preset-expo'))
  try {
    presetRequire.resolve('expo-router')
    return []
  } catch {
    const { expoRouterBabelPlugin } = require('babel-preset-expo/build/expo-router-plugin')
    return [expoRouterBabelPlugin]
  }
}

module.exports = function babelConfig(api) {
  api.cache(true)
  return {
    presets: ['babel-preset-expo'],
    plugins: routerPluginIfPresetCannotSeeIt(),
  }
}
