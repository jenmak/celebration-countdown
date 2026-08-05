const { getDefaultConfig } = require('expo/metro-config')
const path = require('node:path')

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname)

const workspaceRoot = path.resolve(__dirname, '../..')
const reactPath = path.resolve(workspaceRoot, 'node_modules/react')
const reactNativePath = path.resolve(workspaceRoot, 'node_modules/react-native')

config.watchFolders = [workspaceRoot]
config.resolver.nodeModulesPaths = [
  path.resolve(__dirname, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
]

const previousResolveRequest = config.resolver.resolveRequest
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (
    moduleName === 'react' ||
    moduleName === 'react/jsx-runtime' ||
    moduleName === 'react/jsx-dev-runtime'
  ) {
    const filePath =
      moduleName === 'react'
        ? path.join(reactPath, 'index.js')
        : path.join(reactPath, `${moduleName.replace('react/', '')}.js`)
    return { type: 'sourceFile', filePath }
  }

  if (moduleName === 'react-native') {
    return {
      type: 'sourceFile',
      filePath: path.join(reactNativePath, 'index.js'),
    }
  }

  if (previousResolveRequest) {
    return previousResolveRequest(context, moduleName, platform)
  }

  return context.resolveRequest(context, moduleName, platform)
}

module.exports = config
