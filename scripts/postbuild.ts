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
shell.cp('-r', 'packages/common/lib/cjs/*', 'lib');
shell.cp('-r', 'packages/common/lib/mjs/*', 'lib');

[
    'react',
    'vue'
].forEach((packageName) => {
    shell.mkdir(`lib/${packageName}`);
    shell.cp('-r', `packages/${packageName}/lib/cjs/*`, `lib/${packageName}`);
    shell.cp('-r', `packages/${packageName}/lib/mjs/*`, `lib/${packageName}`);
    shell.rm('-r', `packages/${packageName}/lib`);
});

shell.rm('-r', 'lib/**/__tests__');

shell.cp('./README.md', 'lib');
shell.cp('./LICENSE', 'lib');
