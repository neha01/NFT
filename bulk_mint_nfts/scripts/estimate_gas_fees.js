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

async function estimateGas() {
    try {
        const accounts = await web3.eth.getAccounts();
        console.log('accounts:', accounts);
        console.log('contract_address', contract_address);
        const artCollectible = new web3.eth.Contract(
            abiArray,
            contract_address,
            {
                from: accounts[0]
            }
        );
        const ids = getTokenIds(1, 100);
        const amounts = getAmounts(100);
        console.log('Token ids => ', ids);
        console.log('Amounts => ', amounts);
        const gas = await artCollectible.methods
            .mintBatch(ids, amounts)
            .estimateGas();
        console.log('Gas required for batch minting: ', gas);
        // const estimatedGasPrice = await web3.eth.getGasPrice();
        // console.log('estimated network gas price:', estimatedGasPrice);
        const gasPrice = web3.utils.toWei('37', 'gwei');
        console.log('gas cost estimation = ' + gas * gasPrice + ' wei');
        console.log(
            'gas cost estimation = ' +
                web3.utils.fromWei((gas * gasPrice).toString(), 'ether') +
                ' ether'
        );
        const block = await web3.eth.getBlock('latest');
        console.log('block gasLimit:', block.gasLimit);
    } catch (err) {
        console.log('error occurred while estimating gas fees:', err);
    }
}

estimateGas();
