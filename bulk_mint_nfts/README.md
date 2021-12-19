# Bulk Mint NFT

This is accompanying code resource for youtube tutorial link given below.
This project creates a ERC1155 smart contract and then deploys it to Rinkeby testnet/ Mumbai testnet/ Polygon mainnet.
NFT's can then be minted in bulk by sending transaction to the deployed smart contract.

Find the NFT's on Opensea Polygon mainnet: (they are up for sale 😇 🥰 )

https://opensea.io/collection/mandelbrot-julia-set-collection

## Follow the Youtube tutorial here:

### Dependencies:

-   `NodeJS`  
    https://nodejs.org/en/download/

### Usage:

This project can be used to deploy smart contract in two ways:

-   Using remix & metamask (follow the youtube tutorial on above link)
-   From terminal by updating .env files with credentials.

1. Clone the repo and cd into `NFT/bulk_mint_nfts` folder.
   `git clone https://github.com/neha01/NFT.git`

2. Put images that you want to convert into NFTs under images folder.

3. Run `node utils/rename-images-to-numbered-sequence.js` if you want to convert filenames in images directory to hexadecimal format.

4. Upload `images` folder to Pinata and copy the CID for the folder. Update the CID in config.json in `baseUri` field eg: ipfs://<CID>.

5. Run `node utils/create-metadata.js` to create metadata files for each of the images under metadata directory.

6. Now upload `metadata` folder to Pinata and grab CID.

7. Either deploy contract using remix (follow the youtube tutorial on above link ) or deploy via terminal:  
   Update the metadata CID in `ArtCollectible.sol` inside constructor.  
   Update Rinkeby test network details in `truffle-config.js` .  
   Update your account mnemonic in `.env` file.  
   Now run `truffle console --network rinkeby` to connect to Rinkeby Public test network.  
   Run `migrate` command to deploy the contract on Rinkeby testnet.  
   Run `let art = await ArtCollectible.deployed()`.  
   Run `await art.mintBatch([1,2,3,4,5],[1,1,1,1,1])`  
   Enter `art.address` to get contract address.

8. Update `totalNfts` variable in `scripts/bulk_mint_nfts.js` to the amount of Nft's you want to mint and run it `node scripts/bulk_mint_nfts.js` to batch mint Nft's.
