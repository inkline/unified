import * as shell from 'shelljs';
import { resolve } from 'path';

/**
 * Change directory to root
 */

shell.cd(resolve(__dirname, '..'));

/**
 * Copy files to lib folder
 */

shell.mkdir('lib');
shell.cp('-r', 'packages/common/dist/*', 'lib');
shell.rm('-r', 'packages/common/dist');

[
    'react',
    'vue'
].forEach((packageName) => {
    shell.mkdir(`lib/${packageName}`);
    shell.cp('-r', `packages/${packageName}/dist/*`, `lib/${packageName}`);
    shell.rm('-r', `packages/${packageName}/dist`);
});

shell.rm('-r', 'lib/**/__tests__');

shell.cp('./README.md', 'lib');
shell.cp('./LICENSE', 'lib');
