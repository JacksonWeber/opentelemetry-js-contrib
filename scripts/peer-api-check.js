/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// Usage: `node ./scripts/peer-api-check.js`

const fs = require('fs');
const path = require('path');
const globSync = require('glob').sync;
const TOP = path.resolve(__dirname, '..');

function getAllWorkspaceDirs() {
    const pj = JSON.parse(
        fs.readFileSync(path.join(TOP, 'package.json'), 'utf8')
    );
    return pj.workspaces
        .map((wsGlob) => globSync(path.join(wsGlob, 'package.json')))
        .flat()
        .map(path.dirname);
}

// Check on all dirs
getAllWorkspaceDirs().forEach((appRoot) => {
  const packageJsonUrl = path.resolve(`${appRoot}/package.json`);
  const pjson = require(packageJsonUrl);
  const semver = require("semver");
  
  const isExample = pjson.private && /-example$/.test(pjson.name);
  
  if (isExample) {
    return console.log(`Skipping checking ${pjson.name} because it's an example`);
  }
  
  if (pjson.dependencies && pjson.dependencies['@opentelemetry/api']) {
    throw new Error(`Package ${pjson.name} depends on API but it should be a peer dependency`);
  }
  
  const peerVersion = pjson.peerDependencies && pjson.peerDependencies['@opentelemetry/api'];
  const devVersion = pjson.devDependencies && pjson.devDependencies['@opentelemetry/api'];
  if (peerVersion) {
    if (!semver.subset(devVersion, peerVersion)) {
      throw new Error(
        `Package ${pjson.name} depends on peer API version ${peerVersion} ` +
        `but version ${devVersion} in development which doesn't match the peer API version`
      );
    }
    console.log(`${pjson.name} OK`);
  }  
});
