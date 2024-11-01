// scripts/deploy.js
const hre = require("hardhat");

async function main() {
  // We get the contract to deploy
  const Create = await hre.ethers.getContractFactory("Create");
  const create = await Create.deploy();

  await create.deployed();

  console.log("Create contract deployed to:", create.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
