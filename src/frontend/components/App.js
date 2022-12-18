import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom"
import './App.css';
import Home from './Home';

import { useState, useEffect, useRef } from 'react'
import { ethers } from 'ethers'

import NFTAbi from '../contractsData/NFT.json'
import NFTAddress from '../contractsData/NFT-address.json'
import NFT_GooseAbi from '../contractsData/NFT_Goose.json'
import NFT_GooseAddress from '../contractsData/NFT_Goose-address.json'
import NFTStakerAbi from '../contractsData/NFTStaker.json'
import NFTStakerAddress from '../contractsData/NFTStaker-address.json'
import configContract from "./configContract.json";

const fromWei = (num) => ethers.utils.formatEther(num)
const toWei = (num) => ethers.utils.parseEther(num.toString())

function App() {
  const [account, setAccount] = useState(null)
  const [beanBalance, setBeanBalance] = useState(0)
  const [beanNft, setBeanNft] = useState({})
  const [gooseNft, setGooseNft] = useState({})
  const [nftStaker, setNftStaker] = useState({})

  const [menu, setMenu] = useState(0)
  const [currentTimestamp, setCurrentTimestamp] = useState(0)
  const [timeleft, setTimeleft] = useState(0)
  const [provider, setProvider] = useState({})
  const [intervalVariable, setIntervalVariable] = useState(null)
  const [beanToUse, setBeanToUse] = useState(0)

  const providerRef = useRef();
  providerRef.current = provider;
  const beanNftRef = useRef();
  beanNftRef.current = beanNft;
  const gooseNftRef = useRef();
  gooseNftRef.current = gooseNft;
  const nftStakerRef = useRef();
  nftStakerRef.current = nftStaker;
  const accountRef = useRef();
  accountRef.current = account;
  const currentTimestampRef = useRef();
  currentTimestampRef.current = currentTimestamp;
  const intervalRef = useRef();
  intervalRef.current = intervalVariable;
  const timeleftRef = useRef();
  timeleftRef.current = timeleft;

  const closeMenu = () => {
      toggleMenu(0)
  }

  const toggleMenu = async(menuId, requireWeb3) => {
      console.log("toggleMenu " + menuId)
      if (requireWeb3 && account == null)
        await web3Handler()
      if (menu == menuId)
          setMenu(0)
      else
          setMenu(menuId)
  }

  const web3Handler = async () => {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });

    await loadContracts(accounts[0])
    
    setBeanBalance(parseInt(await beanNftRef.current.balanceOf(accounts[0])))
    setAccount(accounts[0])
    loadOpenSeaItems(accounts[0], beanNftRef.current)
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

  const updateCurrentTimestampFromBlockchain = async () => {
    console.log("getCurrentTimestamp")
    const currentBlock = await providerRef.current.getBlockNumber();
    const blockchainTimestamp = (await providerRef.current.getBlock(currentBlock)).timestamp;

    console.log(blockchainTimestamp)
    setCurrentTimestamp(blockchainTimestamp)
  }

  const loadItems = async() => {
    console.log("loadItems")
    updateCurrentTimestampFromBlockchain()

    // Call openSea list
    // Call nftStakerRef list
  }

  const loadContracts = async (acc) => {
    console.log("loadContracts")
    const providerTemp = new ethers.providers.Web3Provider(window.ethereum)
    setProvider(providerTemp)
    const signer = providerTemp.getSigner()

    const beanNft = new ethers.Contract(NFTAddress.address, NFTAbi.abi, signer)
    const gooseNft = new ethers.Contract(NFT_GooseAddress.address, NFT_GooseAbi.abi, signer)
    const nftStaker = new ethers.Contract(NFTStakerAddress.address, NFTStakerAbi.abi, signer)
    setBeanNft(beanNft)
    setGooseNft(gooseNft)
    setNftStaker(nftStaker)

    loadItems()

    nftStaker.on("FeedSuccessful", (user, tokenId) => {
        if (user.toLowerCase() == acc.toLowerCase()) {
          console.log("FeedSuccessful", user, tokenId);
          loadItems()
        }
    });
    nftStaker.on("StakeSuccessful", (user, tokenId, timestamp) => {
        if (user.toLowerCase() == acc.toLowerCase()) {
          console.log("StakeSuccessful", user, tokenId, timestamp);
          loadItems()
        }
    });
    nftStaker.on("UnstakeSuccessful", (user, tokenId, reward) => {
        if (user.toLowerCase() == acc.toLowerCase()) {
          console.log("UnstakeSuccessful", user, tokenId, reward);
          loadItems()
        }
    });

    console.log("beanNft", beanNft.address)
    console.log("gooseNft", gooseNft.address)
    console.log("nftStaker", nftStaker.address)
  }
  
  const iniTimer = () => {
    const timestampEnd = 1671883200000
    // 24th December 8PM GMT +8: 1671883200000 ms
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
      nftStaker?.removeAllListeners("FeedSuccessful");
      nftStaker?.removeAllListeners("StakeSuccessful");
      nftStaker?.removeAllListeners("UnstakeSuccessful");
    };
  }, [])

  return (
    <BrowserRouter>
      <div className="App" id="wrapper">
        <Routes>
          <Route path="/" element={
            <Home beanBalance={beanBalance} closeMenu={closeMenu} toggleMenu={toggleMenu} menu={menu}
              beanToUse={beanToUse} timeleft={timeleft} beanNft={beanNft} gooseNft={gooseNft} nftStaker={nftStaker} >
            </Home>
          } />
          <Route path="/tester" element={
            <Home beanBalance={beanBalance} closeMenu={closeMenu} toggleMenu={toggleMenu} menu={menu}
              beanToUse={beanToUse} beanNft={beanNft} gooseNft={gooseNft} nftStaker={nftStaker} >
            </Home>
          } />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
