require('dotenv').config();
const Web3 = require('web3');
const HDWalletProvider = require('@truffle/hdwallet-provider');

const data = require('../build/contracts/ArtCollectible.json');
const { getTokenIds, getAmounts } = require('./helpers.js');

const abiArray = data.abi;
const contract_address = process.env.CONTRACT_ADDRESS;
const mnemonic = process.env.MNEMONIC;
const clientURL = process.env.CLIENT_URL;
const provider = new HDWalletProvider(mnemonic, clientURL);
const web3 = new Web3(provider);
// Total number of NFT's to be minted
const totalNfts = 145;

async function mintNFT() {
    try {
        const accounts = await web3.eth.getAccounts();
        console.log('accounts:', accounts);
        console.log('contract_address', contract_address);
        // passing third argument is necessary here since the functions with onlyOwner modifier can be only accessed by deployer of contract which is accounts[0] in our case
        const artCollectible = new web3.eth.Contract(
            abiArray,
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
    } catch (err) {
        console.log('error occurred while calling deployed contract:', err);
    }
}

mintNFT();
