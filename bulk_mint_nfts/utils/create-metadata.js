const fs = require('fs');
const path = require('path');

const configFileName = 'config.json';
const imagesDirName = 'images';
const metadataDirName = 'metadata';

const metadataDir = path.resolve(__dirname, '..', metadataDirName);

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

    const fileNames = getAllFileNames(imagesDir);

    console.log('extracted filenames:', fileNames);
    metadataArray = [];

    const metadataDir = path.resolve(__dirname, '..', metadataDirName);

    createDirIfNotExists(metadataDir);

    const promisesArray = fileNames.map((fileName) => {
        new Promise((resolve, reject) => {
            try {
                const fileNameWithoutExtension = path.parse(fileName).name;
                createMetadataFile(
                    {
                        name: `${collectionName} #${fileNameWithoutExtension}`,
                        description: `${description}`,
                        image: `ipfs://${baseUri}/${fileNameWithoutExtension}.png`
                    },
                    fileName
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

function createMetadataFile(metadata, fileName) {
    const fileNameWithoutExtension = path.parse(fileName).name;
    // convert filename to padded hex string
    const hexString = toPaddedHexString(fileNameWithoutExtension, 64);
    fs.writeFileSync(
        `${metadataDir}/${hexString}.json`,
        JSON.stringify(metadata, null, 4),
        'utf8'
    );
    console.log('metadata file created successfully for file: ', fileName);
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
