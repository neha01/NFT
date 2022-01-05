const fs = require('fs');
const path = require('path');

const configFileName = 'config.json';
const imagesDirName = 'images';
const metadataDirName = 'metadata';

const metadataDir = path.resolve(__dirname, '..', metadataDirName);
const useHexadecimalFormatForImagesDir = true;

function getAllFileNames(dir) {
    let fileNames = [];
    try {
        fileNames = fs
            .readdirSync(dir, { withFileTypes: true })
            .filter((item) => !item.isDirectory())
            .map((item) => item.name);
    } catch (err) {
        console.log(
            `error occurred while getting all filenames from directory ${dir}: `,
            err
        );
        throw err;
    }
    return fileNames;
}

function main() {
    const configFilePath = path.resolve(__dirname, '..', configFileName);

    const config = JSON.parse(fs.readFileSync(configFilePath, 'utf8'));
    const collectionName = config.collectionName;
    const description = config.description;
    const baseUri = config.baseUri;

    const imagesDir = path.resolve(__dirname, '..', imagesDirName);

    let fileNames = getAllFileNames(imagesDir);

    console.log('filenames in images directory:', fileNames);
    metadataArray = [];

    const metadataDir = path.resolve(__dirname, '..', metadataDirName);

    createDirIfNotExists(metadataDir);
    const fileExtension = path.extname(fileNames[0] || '');
    // extract filenames without extension
    fileNames = fileNames.map((fileName) => path.parse(fileName).name);

    const promisesArray = fileNames.map((fileName, idx) => {
        new Promise((resolve, reject) => {
            try {
                let hexString = null;
                let sequence = null;
                if (useHexadecimalFormatForImagesDir) {
                    hexString = fileName;
                    sequence = parseInt(hexString, 16);
                } else {
                    hexString = parseInt(idx + 1, 10).toString(16);
                    sequence = idx + 1;
                }
                createMetadataFile(
                    {
                        name: `${collectionName} #${sequence}`,
                        description: `${description}`,
                        image: `${baseUri}/${fileName}${fileExtension}`
                    },
                    hexString
                );
            } catch (err) {
                console.log(
                    `error occurred while creating metadata for file: ${fileName}. Error: ${err}`
                );
                reject();
            }
            resolve();
        });
    });

    Promise.all(promisesArray)
        .then(() =>
            console.log('metadata files creation completed successfully')
        )
        .catch((err) =>
            console.log('error occurred while creating metadata files: ', err)
        );
}

function createMetadataFile(metadata, hexString) {
    // convert filename to padded hex string
    const paddedHexString = toPaddedHexString(hexString, 64);
    fs.writeFileSync(
        `${metadataDir}/${paddedHexString}.json`,
        JSON.stringify(metadata, null, 4),
        'utf8'
    );
    console.log('metadata file created successfully for file: ', hexString);
}

function toPaddedHexString(num, len) {
    return num.toString(16).padStart(len, '0');
}

function createDirIfNotExists(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
}

main();
