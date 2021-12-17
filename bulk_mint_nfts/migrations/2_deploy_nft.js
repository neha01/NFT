const artCollectible = artifacts.require('artCollectible');

module.exports = function (deployer) {
    deployer.deploy(artCollectible);
};
