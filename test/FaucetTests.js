const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Faucet", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployContractAndSetVariables() {
    const Faucet = await ethers.getContractFactory("Faucet");
    const faucet = await Faucet.deploy();

    const [owner] = await ethers.getSigners();
    let withdrawAmount = ethers.parseUnits("1", "ether");

    const destroy = await faucet.destroyFaucet();

    console.log("Signer 1 address: ", owner.address);
    return { faucet, owner, withdrawAmount, destroy };
  }

  it("should deploy and set the owner correctly", async function () {
    const { faucet, owner } = await loadFixture(deployContractAndSetVariables);

    expect(await faucet.owner()).to.equal(owner.address);
  });

  it("should check if withdrawal amount is greater than 0.1 ETH", async function () {
    const { faucet, owner, withdrawAmount } = await loadFixture(
      deployContractAndSetVariables
    );
    expect(await faucet.withdraw(withdrawAmount)).to.be.reverted;
  });

  it("should check if owner calls the fuction", async function () {
    const { faucet, owner, withdrawAmount, destroy } = await loadFixture(
      deployContractAndSetVariables
    );
    expect(owner.address).to.equal(destroy.from);
  });
});
