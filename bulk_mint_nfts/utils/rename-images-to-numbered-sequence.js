const fs = require('fs');
const path = require('path');

const imagesDirName = 'images';

function getAllFileNames(dir) {
    let fileNames = [];
    try {
        fileNames = fs
            .readdirSync(dir, { withFileTypes: true })
            .filter((item) => !item.isDirectory())
            .map((item) => item.name);
    } catch (err) {
        console.log(
            'error occurred while getting all filenames form directory: ',
            err
        );
    }
    return fileNames;
}

// renames the images in a given folder to numbered sequence eg: 1,2,3,4 etc
// may not work for folders containing integer filenames
function main() {
    const imagesDir = path.resolve(__dirname, '..', imagesDirName);
    const fileNames = getAllFileNames(imagesDir);
    console.log('No. of files => ', fileNames.length);
    console.log('Filenames: ', fileNames);
    counter = 1;
    fileNames.map((fileName) => {
        try {
            fs.renameSync(
                `${imagesDir}/${fileName}`,
                `${imagesDir}/${counter}.png`
            );
            console.log(
                `rename successful for file: ${fileName} to ${counter}.png `
            );
            counter++;
        } catch (err) {
            console.log('error ocurred while renaming file: ', fileName);
            throw err;
        }
    });
}

main();
