import { useState, useEffect } from 'react'
import { ethers } from "ethers"
import { Image, Row, Col, Button } from 'react-bootstrap'
import getTimeLeftString from './TimeOperation'
import goose from './assets/Goose.png'

const Nest = ({timeleft, beanBalance, nftStaker, items, currentItemIndex}) => {
    const feedGoose = async() => {
        console.log("Feed Goose button", currentItemIndex)
        await nftStaker.feedGoose(items[currentItemIndex].token_id);
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
                            <div className="actionTitle">You don't have a Goose!</div>
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