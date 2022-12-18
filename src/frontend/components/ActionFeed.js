import { useState, useEffect } from 'react'
import { ethers } from "ethers"
import { Image, Row, Col, Button } from 'react-bootstrap'
import getTimeLeftString from './TimeOperation'
import goose from './assets/Goose.png'

const Nest = ({timeleft}) => {
    let justFed = false
    
    const feedGoose = () => {
        console.log("Feed Goose button")
    }

    return (
        <Row className="actionFrame">
            <Row className="mx-auto textFrame">
                <div className="actionTitle">FEED A BEAN</div>
            </Row>
            <Row className="mx-auto mt-0 mb-4 textFrame gooseDiv">
                {!timeleft ? (
                    <>
                        <Col className="m-auto gooseDiv col-12 col-lg-6">
                            <Image src={goose} className = "gooseImg" />
                            <div className="gooseDescription" >
                                GOOSE #0001
                                <br/>EGG: SILVER
                            </div>
                        </Col>
                        <Col className="m-auto col-12 col-lg-6">
                            {!justFed ? (
                                <>
                                    <div className="gooseDescriptionFeedButton" >
                                        YOU HAVE 2 BEANS
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
                ) : (
                    <div className="actionDescription actionDescriptionBig">LIVE IN {getTimeLeftString(timeleft)}
                    </div>
                )}
            </Row>
        </Row>
    );
}
export default Nest