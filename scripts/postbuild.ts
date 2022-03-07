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
shell.mv('packages/common/lib/cjs/*', 'lib');
shell.mv('packages/common/lib/mjs/*', 'lib');

[
    'react',
    'vue'
].forEach((packageName) => {
    shell.mkdir(`lib/${packageName}`);
    shell.mv(`packages/${packageName}/lib/cjs/*`, `lib/${packageName}`);
    shell.mv(`packages/${packageName}/lib/mjs/*`, `lib/${packageName}`);
});

shell.rm('-r', 'lib/**/__tests__');

shell.cp('./README.md', 'lib');
shell.cp('./LICENSE', 'lib');
