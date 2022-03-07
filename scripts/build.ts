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

shell.cp('./README.md', 'lib');
shell.cp('./LICENSE', 'lib');
shell.cp('-R', './src/*', 'lib');
