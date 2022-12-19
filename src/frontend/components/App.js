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
import Token_EggAbi from '../contractsData/Token_Egg.json'
import Token_EggAddress from '../contractsData/Token_Egg-address.json'
import configContract from "./configContract.json";

const fromWei = (num) => ethers.utils.formatEther(num)
const toWei = (num) => ethers.utils.parseEther(num.toString())

function App() {
  const [account, setAccount] = useState(null)
  const [beanBalance, setBeanBalance] = useState(0)
  const [beanNft, setBeanNft] = useState({})
  const [gooseNft, setGooseNft] = useState({})
  const [nftStaker, setNftStaker] = useState({})
  const [tokenEgg, setTokenEgg] = useState({})

  const [menu, setMenu] = useState(0)
  const [currentTimestamp, setCurrentTimestamp] = useState(0)
  const [timeleft, setTimeleft] = useState(0)
  const [provider, setProvider] = useState({})
  const [intervalVariable, setIntervalVariable] = useState(null)
  const [beanToUse, setBeanToUse] = useState(0)
  const [tokenAllowance, setTokenAllowance] = useState(0)
  const [items, setItems] = useState(null)
  const [currentItemIndex, setCurrentItemIndex] = useState(0)

  const providerRef = useRef();
  providerRef.current = provider;
  const beanNftRef = useRef();
  beanNftRef.current = beanNft;
  const gooseNftRef = useRef();
  gooseNftRef.current = gooseNft;
  const nftStakerRef = useRef();
  nftStakerRef.current = nftStaker;
  const tokenEggRef = useRef();
  tokenEggRef.current = tokenEgg;
  const accountRef = useRef();
  accountRef.current = account;
  const currentTimestampRef = useRef();
  currentTimestampRef.current = currentTimestamp;
  const intervalRef = useRef();
  intervalRef.current = intervalVariable;
  const timeleftRef = useRef();
  timeleftRef.current = timeleft;

  const zeroPad = (num, places) => String(num).padStart(places, '0')

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
    setAccount(accounts[0])

    await loadContracts(accounts[0])

    setBeanBalance(parseInt(await beanNftRef.current.balanceOf(accounts[0])))
    setTokenAllowance(parseInt(await tokenEggRef.current.allowance(accounts[0], nftStakerRef.current.address)))
  }

  const loadOpenSeaBeanToUse = async (acc, nft) => {
    let items = await fetch(`${configContract.OPENSEA_API_TESTNETS}/assets?owner=${acc}&asset_contract_address=${nft.address}&format=json`)
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

  const loadOpenSeaNftGooses = async (acc, nft) => {
    let items = await fetch(`${configContract.OPENSEA_API_TESTNETS}/assets?owner=${acc}&asset_contract_address=${nft.address}&format=json`)
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
    return items
  }

  const updateCurrentTimestampFromBlockchain = async () => {
    return
    console.log("getCurrentTimestamp")
    const currentBlock = await providerRef.current.getBlockNumber();
    const blockchainTimestamp = (await providerRef.current.getBlock(currentBlock)).timestamp;

    console.log(blockchainTimestamp)
    const testOffset = 2 * 24 * 60 * 60 // Set to 0 for live version
    currentTimestampRef.current = (blockchainTimestamp + testOffset) * 1000
  }

  const durationToSeconds = (duration) => {
    const sInDay = 24 * 60 * 60
    if (duration == 2)
      return 60 * sInDay
    if (duration == 1)
      return 30 * sInDay
    return 7 * sInDay
  }

  const durationToReward = (duration) => {
    if (duration == 2)
      return 80
    if (duration == 1)
      return 35
    return 7
  }

  const loadItems = async() => {
    setItems(null)
    console.log("loadItems")
    updateCurrentTimestampFromBlockchain()

    await loadOpenSeaBeanToUse(accountRef.current, beanNftRef.current)
    await new Promise(r => setTimeout(r, 1000));

    let items = await loadOpenSeaNftGooses(accountRef.current, gooseNftRef.current)

    for(let i = 0; i < items.length; i ++) {
      items[i].isStaked = false
      items[i].isFed = accountRef.current.toLowerCase() == (await nftStakerRef.current.tokenFed(items[i].token_id)).toLowerCase()
      items[i].eggType = items[i].isFed ? "GOLD" : "SILVER"
    }

    let itemsStaked = []
    let itemsStakedTokenIds = await nftStakerRef.current.getStakedTokens(accountRef.current)
    if (itemsStakedTokenIds.length > 0) {
      let itemsStakedTimestampStarts = await nftStakerRef.current.getStakedTimestamps(accountRef.current)
      let itemsStakedDurations = await nftStakerRef.current.getStakedDurations(accountRef.current)
      let itemsStakedTaleflyUseds = await nftStakerRef.current.getStakedTaleflyUsed(accountRef.current)

      for(let i = 0; i < itemsStakedTokenIds.length; i++) {
        itemsStaked.push({})
        itemsStaked[i].isStaked = true
        itemsStaked[i].token_id = parseInt(itemsStakedTokenIds[i])
        itemsStaked[i].startTimestamp = parseInt(itemsStakedTimestampStarts[i]) * 1000
        itemsStaked[i].duration = durationToSeconds(parseInt(itemsStakedDurations[i])) * 1000
        itemsStaked[i].taleflyUsed = itemsStakedTaleflyUseds[i]
        itemsStaked[i].name = "GOOSE #" + zeroPad(itemsStaked[i].token_id, 4)
        itemsStaked[i].isFed = accountRef.current.toLowerCase()
          == (await nftStakerRef.current.tokenFed(itemsStaked[i].token_id)).toLowerCase()
        itemsStaked[i].eggType = itemsStaked[i].isFed ? "GOLD" : "SILVER"

        let revertedPercentProgression = (itemsStaked[i].startTimestamp + itemsStaked[i].duration - currentTimestampRef.current) / itemsStaked[i].duration
        itemsStaked[i].eggsHatched = durationToReward(parseInt(itemsStakedDurations[i])) 
          - Math.ceil(durationToReward(parseInt(itemsStakedDurations[i])) * revertedPercentProgression)

        if (itemsStaked[i].eggsHatched > durationToReward(parseInt(itemsStakedDurations[i])))
          itemsStaked[i].eggsHatched = durationToReward(parseInt(itemsStakedDurations[i]))

        itemsStaked[i].collectable = itemsStaked[i].eggsHatched == durationToReward(parseInt(itemsStakedDurations[i]))

        console.log("revertedPercentProgression", revertedPercentProgression)
        if (revertedPercentProgression < 0.3) {
          console.log("Check Wolf")
          itemsStaked[i].isEaten = !itemsStaked[i].taleflyUsed
        }
      }
    }

    // Remove all elements from the OpenSea list that are in the itemsStaked list
    for(let i = 0; i < items.length; i++) {
      let alreadyInOpenSeaList = false
      for(let j = 0; j < itemsStaked.length; j++) {
        if (items[i].token_id == itemsStaked[j].token_id)
          alreadyInOpenSeaList = true
      }

      if (alreadyInOpenSeaList) {
        items[i] = items[items.length - 1]
        items.pop()
      }
    }
    console.log("itemsStaked")
    console.log(itemsStaked)
    
    items = [...items, ...itemsStaked]

    console.log(items)
    setItems(items)
  }

  const loadContracts = async (acc) => {
    console.log("loadContracts")
    const providerTemp = new ethers.providers.Web3Provider(window.ethereum)
    setProvider(providerTemp)
    const signer = providerTemp.getSigner()

    const beanNft = new ethers.Contract(NFTAddress.address, NFTAbi.abi, signer)
    const gooseNft = new ethers.Contract(NFT_GooseAddress.address, NFT_GooseAbi.abi, signer)
    const nftStaker = new ethers.Contract(NFTStakerAddress.address, NFTStakerAbi.abi, signer)
    const tokenEgg = new ethers.Contract(Token_EggAddress.address, Token_EggAbi.abi, signer)
    setBeanNft(beanNft)
    setGooseNft(gooseNft)
    setNftStaker(nftStaker)
    setTokenEgg(tokenEgg)

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

    loadItems()
  }
  
  const iniTimer = () => {
    const timestampEnd = 1671883200000
    // 24th December 8PM GMT +8: 1671883200000 ms
    let timeleftTemp = timestampEnd - Date.now()

    const testOffset = 4 * 24 * 60 * 60 * 1000 // Set to 0 for live version
    let dateNow = Date.now() + testOffset
    setCurrentTimestamp(dateNow)
    setTimeleft(timeleftTemp)
    console.log("timeleftTemp: " + timeleftTemp)
    console.log("Date.now(): " + dateNow)
    console.log("Set interval")
    setIntervalVariable(setInterval(() => {
      setCurrentTimestamp(currentTimestampRef.current + 1000)

      setTimeleft(timestampEnd - dateNow)
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
              beanToUse={beanToUse} timeleft={timeleft} beanNft={beanNft} gooseNft={gooseNft} nftStaker={nftStaker} 
              items={items} currentItemIndex={currentItemIndex} tokenAllowance={tokenAllowance} 
              tokenEgg={tokenEgg} setTokenAllowance={setTokenAllowance} account={account} setCurrentItemIndex={setCurrentItemIndex} 
              currentTimestamp={currentTimestamp} >
            </Home>
          } />
          <Route path="/tester" element={
            <Home beanBalance={beanBalance} closeMenu={closeMenu} toggleMenu={toggleMenu} menu={menu}
              beanToUse={beanToUse} beanNft={beanNft} gooseNft={gooseNft} nftStaker={nftStaker} 
              items={items} currentItemIndex={currentItemIndex} tokenAllowance={tokenAllowance} 
              tokenEgg={tokenEgg} setTokenAllowance={setTokenAllowance} account={account} setCurrentItemIndex={setCurrentItemIndex} 
              currentTimestamp={currentTimestamp} >
            </Home>
          } />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
