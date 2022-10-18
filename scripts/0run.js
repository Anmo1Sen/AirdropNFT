const { ethers } = require("hardhat");
require("dotenv").config();
const hre = require("hardhat");

async function main() {

  // Define a list of allowlisted wallets
  const allowlistedAddresses = [
    '0xf97B607a4fC6f8C8840ecEBbFCBA1f922698Ed4c',
    '0x9737ef9aef4f9e75a0f46F7a8CA5e2d7fF727572',
    '0x6232735e148d20e97046871C014b1BfF32cF44D0',
    '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
  ];

  // Select an allowlisted address to mint NFT
  const selectedAddress = '0x6232735e148d20e97046871C014b1BfF32cF44D0'

  // Define wallet that will be used to sign messages
  const walletAddress =  process.env.PUBLIC_KEY;// owner.address
  const privateKey = process.env.PRIVATE_KEY;
  const signer = new ethers.Wallet(privateKey);
  console.log("Wallet used to sign messages: ", signer.address, "\n");

  let messageHash, signature;

  // Check if selected address is in allowlist
  // If yes, sign the wallet's address
  if (allowlistedAddresses.includes(selectedAddress)) {
    console.log("Address is allowlisted! Minting should be possible.");

    // Compute message hash
    messageHash = ethers.utils.id(selectedAddress);
    console.log("Message Hash: ", messageHash);

    // Sign the message hash
    let messageBytes = ethers.utils.arrayify(messageHash);
    signature = await signer.signMessage(messageBytes);
    console.log("Signature: ", signature, "\n");
  }

  const factory = await hre.ethers.getContractFactory("NFTAllowlistofchn");
  const [owner, address1, address2] = await hre.ethers.getSigners();
  const contract = await factory.deploy();

  await contract.deployed();
  console.log("Contract deployed to: ", contract.address);
  console.log("Contract deployed by (Owner/Signing Wallet): ", owner.address, "\n");

  recover = await contract.recoverSigner(messageHash, signature);
  console.log("Message was signed by: ", recover.toString());

  let txn;
  txn = await contract.preSale(2, messageHash, signature);
  await txn.wait();
  console.log("NFTs minted successfully!");

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
/*
  Wallet used to sign messages:  0x849ADaA07a15EbE41dA760ed02a0E3d7127604E7 

Address is allowlisted! Minting should be possible.
Message Hash:  0x6036aac3bb25c92acfa90dfd14a86c9778e0c74afa1714be54da6cc86be2ce3f
Signature:  0xbc1ddc6df29f41eaa104c559a70ef5593ca37cbb19c559a5f268243e9c637ba458985c392534a337f026266eae435496737abc61d288c4f48686f5f64fd0702f1c

Contract deployed to:  0x5D7eA89556B38F807a5D68Cd36281D832f36D20D
Contract deployed by (Owner/Signing Wallet):  0x849ADaA07a15EbE41dA760ed02a0E3d7127604E7

Message was signed by:  0x849ADaA07a15EbE41dA760ed02a0E3d7127604E7
NFTs minted successfully
*/