const { ethers } = require("hardhat");
const hre = require("hardhat");

async function main() {

  // Define a list of wallets to airdrop NFTs
  const airdropAddresses = [
    '0xf97B607a4fC6f8C8840ecEBbFCBA1f922698Ed4c',
    '0x9737ef9aef4f9e75a0f46F7a8CA5e2d7fF727572',
    '0x6232735e148d20e97046871C014b1BfF32cF44D0',
    '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
 
  ];

  const factory = await hre.ethers.getContractFactory("NFTAirdrop");
  const [owner] = await hre.ethers.getSigners();
  const contract = await factory.deploy();

  await contract.deployed();
  console.log("Contract deployed to: ", contract.address);
  console.log("Contract deployed by (Owner): ", owner.address, "\n");

  let txn;
  txn = await contract.airdropNfts(airdropAddresses);
  await txn.wait();
  console.log("NFTs airdropped successfully!");

  console.log("\nCurrent NFT balances:")
  for (let i = 0; i < airdropAddresses.length; i++) {
    let bal = await contract.balanceOf(airdropAddresses[i]);
    console.log(`${i + 1}. ${airdropAddresses[i]}: ${bal}`);
  }

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });


/*
  Contract deployed to:  0x7F3FfDC0a8139ec6E671a58B87537104bF1bBba1
Contract deployed by (Owner):  0x849ADaA07a15EbE41dA760ed02a0E3d7127604E7 

NFTs airdropped successfully!

Current NFT balances:
1. 0xf97B607a4fC6f8C8840ecEBbFCBA1f922698Ed4c: 1
2. 0x9737ef9aef4f9e75a0f46F7a8CA5e2d7fF727572: 1
3. 0x6232735e148d20e97046871C014b1BfF32cF44D0: 1
4. 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266: 1
*/