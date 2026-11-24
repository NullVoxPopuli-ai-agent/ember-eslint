import { existsSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join } from 'node:path';

const babelConfigCandidates = [
  'babel.config.cjs',
  'babel.config.mjs',
  'babel.config.js',
];

export function hasBabelConfig(root) {
  return babelConfigCandidates.some((candidate) => {
    return existsSync(join(root, candidate));
  });
}

export function hasTypescript(root) {
  return existsSync(join(root, 'tsconfig.json'));
}

function readManifest(root) {
  let manifestPath = join(root, 'package.json');
  let buffer = readFileSync(manifestPath);

  return JSON.parse(buffer.toString());
}

export function hasTypeModule(root) {
  return readManifest(root).type === 'module';
}

export function isV2Addon(root) {
  let manifest = readManifest(root);

  return (
    Boolean(manifest.keywords?.includes('ember-addon')) &&
    manifest['ember-addon']?.version === 2
  );
}

/**
 * Resolves from the project, not from ember-eslint,
 * so that only projects that install the package pay for it.
 */
export function optionalRequire(root, specifier) {
  let require = createRequire(join(root, 'package.json'));
  let resolved;

  try {
    resolved = require.resolve(specifier);
  } catch {
    return undefined;
  }

  return require(resolved);
}
