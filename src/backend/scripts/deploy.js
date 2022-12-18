const TokenEggAbi = require('../../frontend/contractsData/Token_Egg.json')

const fromWei = (num) => ethers.utils.formatEther(num)

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", fromWei(await deployer.getBalance()));
  
  // const NFT = await ethers.getContractFactory("NFT");
  // const nft = await NFT.deploy();
  // console.log("NFT contract address", nft.address)
  // saveFrontendFiles(nft, "NFT");

  // const Planting = await ethers.getContractFactory("Planting");
  // const planting = await Planting.deploy(nft.address);
  // console.log("Planting contract address", planting.address)
  // saveFrontendFiles(planting, "Planting");
  
  // await nft.setPlantingAddress(planting.address);

  // console.log("setPlantingAddress called")

  // // For testing
  // await nft.setMintEnabled(true);
  // await nft.setPrice(0);
  // await nft.mint(1, { value: 0});
  // console.log("Goerli test functions called")

  // Phase 2 deployment code
  // const plantingAddress = "0x2792a863fcD0e2ad62272f6aD6E8746DBC527aF6" // Goerli
  // const plantingAddress = "0xEBfCF2708F4DA3E07Eb55c8D599e97fEE4c2ACF5" // Mainnet

  // const NFT_Goose = await ethers.getContractFactory("NFT_Goose");
  // const Token_Egg = await ethers.getContractFactory("Token_Egg");
  // const Castle = await ethers.getContractFactory("Castle");

  // const nftGoose = await NFT_Goose.deploy();
  // console.log("nftGoose contract address", nftGoose.address)
  // saveFrontendFiles(nftGoose, "NFT_Goose");

  // const castle = await Castle.deploy(plantingAddress, nftGoose.address);
  // console.log("castle contract address", castle.address)
  // saveFrontendFiles(castle, "Castle");

  // const tokenEgg = await Token_Egg.deploy(castle.address, deployer.address);
  // console.log("tokenEgg contract address", tokenEgg.address)
  // saveFrontendFiles(tokenEgg, "Token_Egg");

  // await nftGoose.setCastleAddress(castle.address);
  // await castle.setTokenAddress(tokenEgg.address);
  // console.log("Set address functions called")

  // Phase 3 deployment code
  let wolfAddress = "0x0000000000000000000000000000000000000000" // Replace with Wolf address
  let nftGooseAddress = "0x46Ce726522BEc0c410D8896ba16A330B416f1cf0" // Goerli
  let tokenEggAddress = "0xb59691e131c2e5cCf55CC1aC9a365b96E25b4787" // Goerli
  let nftBeanAddress = "0x84e6668a2dFAB9Fe137F3350C10E0A1108BEeDB9" // Goerli

  const NFTStaker =  await ethers.getContractFactory("NFTStaker");
  const nftStaker = await NFTStaker.deploy(nftGooseAddress, nftBeanAddress, wolfAddress);
  console.log("nftStaker contract address", nftStaker.address)
  saveFrontendFiles(nftStaker, "NFTStaker");

  await nftStaker.setTokenAddress(tokenEggAddress);
  console.log("nftStaker setTokenAddress functions called")
  
  // Optional: Transfer tokens from team wallet to staker address
  const tokenEgg = new ethers.Contract(tokenEggAddress, TokenEggAbi.abi)
  let stakerTokenBalance = 1_000; // How much to send?
  await tokenEgg.connect(deployer).transfer(nftStaker.address, stakerTokenBalance);
  console.log("tokens transfered to nft staker")
}

function saveFrontendFiles(contract, name) {
  const fs = require("fs");
  const contractsDir = __dirname + "/../../frontend/contractsData";

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    contractsDir + `/${name}-address.json`,
    JSON.stringify({ address: contract.address }, undefined, 2)
  );

  const contractArtifact = artifacts.readArtifactSync(name);

  fs.writeFileSync(
    contractsDir + `/${name}.json`,
    JSON.stringify(contractArtifact, null, 2)
  );
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
