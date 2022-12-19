import { useState, useEffect } from 'react'
import { ethers } from "ethers"
import { Image, Row, Col, Button } from 'react-bootstrap'
import getTimeLeftString from './TimeOperation'
import goose from './assets/Goose.png'

const Nest = ({timeleft, beanBalance, nftStaker, items, currentItemIndex, beanNft, beanToUse, setCurrentItemIndex}) => {
    const feedGoose = async() => {
        console.log("Feed Goose button", currentItemIndex)
        
        await beanNft.approve(nftStaker.address, beanToUse);
        await nftStaker.feedGoose(items[currentItemIndex].token_id, beanToUse);
    }

    const itemsNullOrEmptyText = () => {
        if (items == null)
            return "Loading..."
        return "You don't have a Goose!"
    }

    const nextPage = (direction) => {
        console.log("nextPage", direction)
        setCurrentItemIndex(currentItemIndex + direction)
    }

    return (
        <Row className="actionFrame">
            <Row className="mx-auto textFrame">
                <div className="actionTitle">FEED A BEAN</div>
            </Row>
            <Row className="mx-auto mt-0 mb-4 textFrame gooseDiv">
                {!timeleft ? (
                    <>
                        {items == null || items.length == 0 ? (
                            <div className="actionTitle">{itemsNullOrEmptyText()}</div>
                        ) : (
                            <>
                                <Col className="m-auto gooseDiv col-12 col-lg-6">
                                    <Image src={goose} className = "gooseImg" />
                                    <div className="gooseDescription" >
                                        {items[currentItemIndex].name}
                                        <br/>EGG: {items[currentItemIndex].eggType}
                                    </div>
                                </Col>
                                <Col className="m-auto col-12 col-lg-6">
                                    {!items[currentItemIndex].isFed ? (
                                        <>
                                            <div className="gooseDescriptionFeedButton" >
                                                YOU HAVE {beanBalance} BEANS
                                            </div>
                                            <div className="actionButton" onClick={feedGoose} >
                                                FEED
                                            </div>
                                        </>
                                    ) : (
                                        <div className="gooseDescriptionFeedButtonSmall" >
                                            GOOSE WAS FED WITH A BEAN. IT WILL LAYS GOLD EGGS NOW. THIS EFFECT IS VALID FOR ONE TIME STAKING ONLY. UNSTAKE, OR TRANSFER WILL CAUSE THIS EFFECT TO WEAR OFF!
                                        </div>
                                    )}
                                </Col>

                                {/* PAGINATION ARROWS */}
                                <div className="arrowsDiv">
                                    {currentItemIndex > 0 ? (
                                            <div className={"leftArrow"} onClick={() => nextPage(-1)}></div>
                                    ) : ( <></> )}
                                    {items != null && currentItemIndex < items.length - 1 ? (
                                            <div className={"rightArrow"} onClick={() => nextPage(1)}></div>
                                    ) : ( <></> )}
                                </div>
                            </>
                        )}
                    </>
                ) : (
                    <div className="actionDescription actionDescriptionBig">LIVE IN {getTimeLeftString(timeleft)}
                    </div>
                )}
            </Row>
        </Row>
    );
}
export default Nest