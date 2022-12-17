import { useState, useEffect } from 'react'
import { ethers } from "ethers"
import { Image, Row, Col, Button } from 'react-bootstrap'
import logo from './assets/logo.png'
import logoMobile from './assets/mobile/logo.png'
import menuIcon from './assets/mobile/menu.png'
import homeIcon from './assets/mobile/home.png'
import HowTo from './ActionHowTo'
import Nest from './ActionNest'
import Feed from './ActionFeed'
import Social from './ActionSocial'
import Menu from './ActionMenu'
import Mint from './ActionMint'

const fromWei = (num) => ethers.utils.formatEther(num)
const toWei = (num) => ethers.utils.parseEther(num.toString())

const Home = ({ timeleft, farmButton, web3Handler, plantPhase, account, price, supplyLeft, balance, closeMenu, toggleMenu, menu, changeQuantity, mintButton, quantity }) => {

    const buttonLinkOnClick = async (elementId) => {
        console.log("buttonLinkOnClick: " + elementId)
        var ex = document.getElementById(elementId);
        ex.click();
    }

    return (
        <div className="m-0 p-0 Home">
            {/* LOGO */}
            <div className="logoDiv d-none d-xl-block"> <Image src={logo} className = "logo" /> </div>
            <div className="logoDiv d-xl-none"> <Image src={logoMobile} className = "logo" /> </div>


            {/* NAVBAR */}
            <div className="navbarMobileDiv d-xl-none"> 
                <Row className="menuMobileCol">
                    <Col className="col-6 homeMobileCol">
                        <Image src={homeIcon} className = "homeMobileImage"  onClick={() => closeMenu()} />
                    </Col>
                    <Col className="col-6 menuMobileCol">
                        <Image src={menuIcon} className = "menuMobileImage"  onClick={() => toggleMenu(10)} />
                    </Col>
                </Row>
            </div>

            {/* BUTTONS */}
            <div className="m-0 p-0 container-fluid d-none d-xl-block">
                <Row className="m-0 p-0">
                    <Col className="ps-5 pe-0 mx-0 my-4 col-3" style={{marginLeft: "", backgroundColor: "rgb(1,1,1,0.0)"}}>
                        <Row className="mx-0 p-0" style={{marginTop: "30vh"}}>
                            <div className="actionButton" onClick={() => buttonLinkOnClick('openseaLink')} >
                                OPENSEA
                                <a href="https://opensea.io/collection/goosebumper" target="_blank" id="openseaLink"></a>
                            </div>
                        </Row>
                        <Row className="m-0 p-0">
                            <div className="actionButton" onClick={() => toggleMenu(4)} >
                                NEST
                            </div>
                        </Row>
                        <Row className="m-0 p-0">
                            <div className="actionButton" onClick={() => toggleMenu(5)} >
                                FEED A BEAN
                            </div>
                        </Row>
                    </Col>
                    <Col className="m-0 p-0 col-6" style={{backgroundColor: "rgb(1,1,0,0.0)"}}>
                    </Col>
                    <Col className="pe-5 ps-0 mx-0 my-4 col-3" style={{marginLeft: "", backgroundColor: "rgb(1,1,1,0.0)"}}>
                        <Row className="mx-0 p-0" style={{marginTop: "30vh"}}>
                            <div className="actionButton" onClick={() => buttonLinkOnClick('tokenLink')} >
                                TALE TOKEN
                                <a href="https://twitter.com/beanstalkerxyz" target="_blank" id="tokenLink"></a>
                            </div>
                        </Row>
                        <Row className="m-0 p-0">
                            <div className="actionButton" onClick={() => toggleMenu(2)} >
                                HOW TO
                            </div>
                        </Row>
                        <Row className="m-0 p-0">
                            <div className="actionButton" onClick={() => toggleMenu(6)} >
                                SOCIAL
                                <a href="https://taletinker.com" target="_blank" id="aboutusLink"></a>
                            </div>
                        </Row>
                    </Col>
                </Row>
            </div>

            {/* FRAME */}
            {
                {
                '0': <></>,
                '1': <Mint web3Handler={web3Handler} account={account} supplyLeft={supplyLeft} balance={balance} 
                        changeQuantity={changeQuantity} mintButton={mintButton} quantity={quantity}
                        price={price} plantPhase={plantPhase} farmButton={farmButton} />,
                '2': <HowTo />,
                '4': <Nest timeleft={timeleft} />,
                '5': <Feed timeleft={timeleft} />,
                '6': <Social />,
                '10': <Menu toggleMenu={toggleMenu} buttonLinkOnClick={buttonLinkOnClick} farmButton={farmButton} />,
                }[menu]
            }
        </div>
    );
}
export default Home