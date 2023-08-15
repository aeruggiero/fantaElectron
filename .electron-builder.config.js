/**
 * TODO: Rewrite this config to ESM
 * But currently electron-builder doesn't support ESM configs
 * @see https://github.com/develar/read-config-file/issues/10
 */

/**
 * @type {() => import('electron-builder').Configuration}
 * @see https://www.electron.build/configuration/configuration
 */
module.exports = async function () {
  const {getVersion} = await import('./version/getVersion.mjs');

  return {
    directories: {
      output: 'dist',
    },
    productName: 'FantaElectron',
    files: ['packages/**/dist/**'],
    extraMetadata: {
      version: getVersion(),
    },
    win: {
      icon: './icon.ico',
      target: ['portable'],
    },
    portable: {
      artifactName: 'pvmplayer_portable.exe',
    },
    // Specify linux target just for disabling snap compilation
    linux: {
      target: 'deb',
    },
  };
};
