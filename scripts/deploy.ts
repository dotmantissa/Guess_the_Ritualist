import { ethers } from "hardhat";

async function main() {
  console.log("Starting deployment...");

  const ScoreRegistry = await ethers.getContractFactory("ScoreRegistry");
  const registry = await ScoreRegistry.deploy();

  await registry.waitForDeployment();

  const address = await registry.getAddress();
  console.log(`ScoreRegistry deployed to Ritual Chain at address: ${address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
