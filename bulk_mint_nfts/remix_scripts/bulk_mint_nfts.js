// Right click on the script name and hit 'Run' to execute
(async () => {
    try {
        const totalNfts = 145;

        console.log('Running bulk_mint_nfts script...');

        const contractName = 'ArtCollectible'; // Change this for other contract
        const contract_address = 'YOUR_DEPLOYED_CONTRACT_ADDRESS';

        // Note that the script needs the ABI which is generated from the compilation artifact.
        // Make sure contract is compiled and artifacts are generated
        const artifactsPath = `browser/contracts/artifacts/${contractName}.json`; // Change this for different path

        const metadata = JSON.parse(
            await remix.call('fileManager', 'getFile', artifactsPath)
        );
        const accounts = await web3.eth.getAccounts();

        const artCollectible = new web3.eth.Contract(
            metadata.abi,
            contract_address,
            {
                from: accounts[0]
            }
        );

        // NFT's to mint in each transaction
        const mintSize = 100;
        for (let i = 1, j = totalNfts; i <= j; i += mintSize) {
            if (mintSize === 0) {
                throw new Error(
                    'Please specify greater than zero value for mintSize'
                );
            }
            let currentMintSize = mintSize;
            if (i + mintSize <= totalNfts + 1) {
                currentMintSize = mintSize;
            } else {
                // case when totalNfts is not a multiple of mintSize
                currentMintSize = totalNfts - i + 1;
            }
            // array containing tokenIds
            const ids = getTokenIds(i, currentMintSize);
            // array containing amount to mint for each tokenId, 1 in case of NFT's
            const amounts = getAmounts(currentMintSize);
            console.log('Token Ids to be minted in current batch => ', ids);
            console.log(
                'Amounts to be minted for each Token Id in current batch => ',
                amounts
            );
            await artCollectible.methods
                .mintBatch(ids, amounts)
                .send({ from: accounts[0] });
            console.log('successfully batch minted NFTs for current batch');
        }

        // https://docs.openzeppelin.com/contracts/2.x/api/token/erc721#IERC721-balanceOf-address-
        // returns number of NFT's in owner's account for tokenID 1
        const balance = await artCollectible.methods
            .balanceOf(accounts[0], 1)
            .call();
        console.log('balance: ', balance);
    } catch (e) {
        console.log(e.message);
    }
})();

function getTokenIds(startTokenId, size) {
    return Array(size)
        .fill()
        .map((element, index) => index + startTokenId);
}

function getAmounts(size) {
    return Array(size).fill(1);
}
