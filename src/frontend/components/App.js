import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom"
import './App.css';
import Home from './Home';
import Farm from './Farm';

import { useState, useEffect, useRef } from 'react'
import { ethers } from 'ethers'

import NFTAbi from '../contractsData/NFT.json'
import NFTAddress from '../contractsData/NFT-address.json'
import PlantingAbi from '../contractsData/Planting.json'
import PlantingAddress from '../contractsData/Planting-address.json'
import CastleAbi from '../contractsData/Castle.json'
import CastleAddress from '../contractsData/Castle-address.json'
import configContract from "./configContract.json";

const fromWei = (num) => ethers.utils.formatEther(num)
const toWei = (num) => ethers.utils.parseEther(num.toString())

const totalSupply = 5000

function App() {
  const [account, setAccount] = useState(null)
  const [balance, setBalance] = useState(0)
  const [supplyLeft, setSupplyLeft] = useState(totalSupply)
  const [price, setPrice] = useState(0.01)
  const [nft, setNFT] = useState({})
  const [castle, setCastle] = useState({})
  const [castleLooted, setCastleLooted] = useState(0)
  const [planting, setPlanting] = useState({})
  const [menu, setMenu] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [menuFarm, setMenuFarm] = useState(false)
  const [beanToUse, setBeanToUse] = useState(0)
  const [amountMinted, setAmountMinted] = useState(0)
  const [currentTimestamp, setCurrentTimestamp] = useState(0)
  const [plantObject, setPlantObject] = useState({})
  const [plant, setPlant] = useState(0)
  const [timeleft, setTimeleft] = useState(0)
  const [provider, setProvider] = useState({})
  const [intervalVariable, setIntervalVariable] = useState(null)
  let timeleftLastTick = 0

  const providerRef = useRef();
  providerRef.current = provider;
  const quantityRef = useRef();
  quantityRef.current = quantity;
  const balanceRef = useRef();
  balanceRef.current = balance;
  const supplyLeftRef = useRef();
  supplyLeftRef.current = supplyLeft;
  const amountMintedRef = useRef();
  amountMintedRef.current = amountMinted;
  const plantingRef = useRef();
  plantingRef.current = planting;
  const nftRef = useRef();
  nftRef.current = nft;
  const accountRef = useRef();
  accountRef.current = account;
  const currentTimestampRef = useRef();
  currentTimestampRef.current = currentTimestamp;
  const intervalRef = useRef();
  intervalRef.current = intervalVariable;
  const timeleftRef = useRef();
  timeleftRef.current = timeleft;

  const farmButton = async () => {
    closeMenu(); 
    if (account == null) 
      await web3Handler(); 
    setMenuFarm(true);
  }
  
  const changeQuantity = (direction) => {
      if (quantity + direction < 1)
          setQuantity(1)
      else if (quantity + direction > 2)
          setQuantity(2)
      else
          setQuantity(quantity + direction)
  }

  const mintButton = async () => {
      console.log("mint button")
      let price = fromWei(await nft.getPrice()) * quantity;
      console.log("Price: " + price + " wei");
      console.log("Quantity: " + quantity)
      await nft.mint(quantity, { value: toWei(price) });
  }

  const closeMenu = () => {
      toggleMenu(0)
  }

  const toggleMenu = (menuId) => {
      console.log("toggleMenu " + menuId)
      if (menu == menuId)
          setMenu(0)
      else
          setMenu(menuId)
  }

  const web3Handler = async () => {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });

    await loadContracts(accounts[0])
    
    setBalance(await nftRef.current.balanceOf(accounts[0]))
    setAccount(accounts[0])
    loadOpenSeaItems(accounts[0], nftRef.current)
  }

  const loadOpenSeaItems = async (acc, nft) => {
    let items = await fetch(`${configContract.OPENSEA_API}/assets?owner=${acc}&asset_contract_address=${nft.address}&format=json`)
    .then((res) => res.json())
    .then((res) => {
      return res.assets
    })
    .catch((e) => {
      console.error(e)
      console.error('Could not talk to OpenSea')
      return null
    })

    console.log(items)

    if (items != null && items.length > 0) {
      console.log("bean to use: " + items[0].token_id)
      setBeanToUse(items[0].token_id)
    }
    else 
      console.log("OpenSea could not find a bean for address " + acc)
  }


  const mintFinished = async (nft) => {
      console.log("mintFinished: " + quantityRef.current)
      setSupplyLeft(supplyLeftRef.current - quantityRef.current)
      setBalance(balanceRef.current + quantityRef.current)
      // setBeanToUse(amountMintedRef.current)
  }

  const updateCurrentTimestampFromBlockchain = async () => {
    console.log("getCurrentTimestamp")
    const currentBlock = await providerRef.current.getBlockNumber();
    const blockchainTimestamp = (await providerRef.current.getBlock(currentBlock)).timestamp;

    console.log(blockchainTimestamp)
    setCurrentTimestamp(blockchainTimestamp)
  }

  const loadContracts = async (acc) => {
    console.log("loadContracts")
    const providerTemp = new ethers.providers.Web3Provider(window.ethereum)
    setProvider(providerTemp)
    const signer = providerTemp.getSigner()

    const nft = new ethers.Contract(NFTAddress.address, NFTAbi.abi, signer)
    const planting = new ethers.Contract(PlantingAddress.address, PlantingAbi.abi, signer)
    const castle = new ethers.Contract(CastleAddress.address, CastleAbi.abi, signer)
    const amountMintedTemp = parseInt(await nft.totalSupply()) + parseInt(await nft.burnAmount())
    setAmountMinted(amountMintedTemp)
    const supplyLeftTemp = totalSupply - amountMintedTemp
    console.log("tickets left: " + supplyLeftTemp)
    setSupplyLeft(supplyLeftTemp)
    setPrice(fromWei(await nft.getPrice()))
    const userLooted = parseInt(await castle.userLooted(acc))
    console.log("userLooted", userLooted)
    setCastleLooted(userLooted)
    setNFT(nft)
    setCastle(castle)
    setPlanting(planting)
    nft.on("MintSuccessful", (user) => {
        console.log("MintSuccessful");
        console.log(user);
        console.log(acc);
        if (user.toLowerCase() == acc.toLowerCase()) {
          mintFinished(nft);
        }
    });

    console.log("nft address: " + nft.address)
    console.log("planting address: " + planting.address)
  }
  
  const iniTimer = () => {
    const timestampEnd = 1671883200000
    // 23th December 8PM GMT +8: 1671883200000 ms
    let timeleftTemp = timestampEnd - Date.now()
    setCurrentTimestamp(Date.now())
    setTimeleft(timeleftTemp)
    console.log("timeleftTemp: " + timeleftTemp)
    console.log("Date.now(): " + Date.now())
    console.log("Set interval")
    setIntervalVariable(setInterval(() => {
      setCurrentTimestamp(currentTimestampRef.current + 1000)

      setTimeleft(timestampEnd - Date.now())
    }, 1000))
  }
  useEffect(async () => {
    iniTimer()
    return () => {
      clearInterval(intervalRef.current);
      // nft?.removeAllListeners("MintSuccessful");
    };
  }, [])

  return (
    <BrowserRouter>
      <div className="App" id="wrapper">
        <Home web3Handler={web3Handler} account={account} planting={planting} 
          supplyLeft={supplyLeft} balance={balance} closeMenu={closeMenu} toggleMenu={toggleMenu} menu={menu} price={price}
          changeQuantity={changeQuantity} mintButton={mintButton} quantity={quantity} plantPhase={plant}
          farmButton={farmButton} timeleft={timeleft}>
        </Home>
      </div>
    </BrowserRouter>
  );
}

export default App;
