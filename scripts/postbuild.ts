import * as shell from 'shelljs';
import { resolve } from 'path';

/**
 * Change directory to root
 */

shell.cd(resolve(__dirname, '..'));

/**
 * Copy files to lib folder
 */

shell.mv('dist', 'lib');
shell.cp('./README.md', 'lib');
shell.cp('./LICENSE', 'lib');
