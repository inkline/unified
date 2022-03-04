import * as shell from 'shelljs';
import { resolve } from 'path';

/**
 * Change directory to root
 */

shell.cd(resolve(__dirname, '..'));

/**
 * Copy files to lib folder
 */

[
    'react',
    'vue'
].forEach((packageName) => {
    shell.mv(`lib/${packageName}`, `lib/${packageName}-tmp`);

    shell.mv(`lib/${packageName}-tmp/cjs/*`, `lib/${packageName}-tmp`);
    shell.mv(`lib/${packageName}-tmp/mjs/*`, `lib/${packageName}-tmp`);
    shell.rm('-r', `lib/${packageName}-tmp/cjs`);
    shell.rm('-r', `lib/${packageName}-tmp/mjs`);

    shell.mv(`lib/${packageName}-tmp/*`, 'lib');

    shell.rm('-r', `lib/${packageName}-tmp`);
});

shell.rm('-r', 'lib/**/__tests__');

shell.cp('./README.md', 'lib');
shell.cp('./LICENSE', 'lib');
