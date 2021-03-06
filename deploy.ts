const { execSync } = require('child_process');

try {
    console.log('--- Checking if the current branch is main ---');
    const branch = execSync('git symbolic-ref --short -q HEAD').toString().replace(/(\r\n|\n|\r)/gm,""); // remove line-breaks
    if (branch.toString() !== 'main'){
        throw new Error('Can\'t execute this script outside main branch. please switch and rerun this script')
    }

    console.log('--- Checking if there are any uncommited changes ---')
    const uncommitedChanges = execSync('git status --porcelain')
    if(uncommitedChanges.toString() !== ''){
        throw new Error('You have uncommited changes. please commit/stash changes before deploying')
    }

    console.log('--- Removing old build ---');
    execSync('rm -rf ./docs');
    execSync('rm -rf ./build');

    console.log('--- Building app ---');
    execSync('npm run build');

    console.log('--- Changing output directory name ---');
    execSync('mv ./build ./docs');

    console.log('--- Commiting change ---');
    execSync('git add ./docs/*');
    execSync('git commit -m \'new version\'');

    console.log('--- Pushing changes to origin ---');
    const res = execSync('git push origin main');
} catch(e) {
    console.warn('An error occured: ', e.toString())
}
