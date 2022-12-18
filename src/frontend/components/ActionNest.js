import { useState, useEffect } from 'react'
import { ethers } from "ethers"
import { Image, Row, Col, Button } from 'react-bootstrap'
import getTimeLeftString from './TimeOperation'
import goose from './assets/Goose.png'

const Nest = ({account, timeleft, nftStaker, gooseNft, tokenEgg, items, currentItemIndex, tokenAllowance, setTokenAllowance}) => {
    const [duration, setDuration] = useState(0)
    
    const stakeGoose = async(useTalefly) => {
        console.log("StakeGoose button", currentItemIndex, useTalefly, duration)
        if (useTalefly) {
            if (tokenAllowance < 25) {
                await tokenEgg.approve(nftStaker.address, 1000);
                setTokenAllowance(parseInt(await tokenEgg.allowance(account, nftStaker.address)))
            }
        }
        await gooseNft.approve(nftStaker.address, items[currentItemIndex].token_id);
        await nftStaker.stake(items[currentItemIndex].token_id, duration, useTalefly);
    }
    
    const unstakeGoose = async() => {
        console.log("unstakeGoose button", currentItemIndex)
        await nftStaker.unstake(items[currentItemIndex].token_id);
    }
    
    const selectDuration = (id) => {
        console.log("selectDuration " + id)
        setDuration(id)

        for(let i = 0; i < 3; i++) {
            var selectedElement = document.getElementById("duration-" + i);
            selectedElement.classList.remove("durationselect");
            selectedElement.classList.add("durationunselect");
        }

        var selectedElement = document.getElementById("duration-" + id);
        selectedElement.classList.remove("durationunselect");
        selectedElement.classList.add("durationselect");
    }

    return (
        <Row className="actionFrame">
            <Row className="mx-auto textFrame">
                <div className="actionTitle">STAKE / LAY EGGS</div>
            </Row>
            <Row className="mx-auto mt-0 mb-4 textFrame">
                {!timeleft ? (
                    <>
                        {items == null || items.length == 0 ? (
                            <div className="actionTitle">You don't have a Goose!</div>
                        ) : (
                            <>
                                <Col className="m-auto gooseDiv col-12 col-lg-6">
                                    <Image src={goose} className = "gooseImg" />
                                    <div className="gooseDescription mb-2" >
                                        {items[currentItemIndex].name}
                                        {/* GOOSE #0001 */}
                                        {/* <br/>EGG: GOLD */}
                                        <br/>EGG: {items[currentItemIndex].eggType}
                                    </div>
                                </Col>
                                <Col className="m-auto col-12 col-lg-6">
                                    {!items[currentItemIndex].isStaked ? (
                                        <>
                                            <div className="actionButtonNest" onClick={() => stakeGoose(true)} >
                                                STAKE WITH TALEFLY
                                            </div>
                                            <div className="actionButtonNest" onClick={() => stakeGoose(false)} >
                                                STAKE WITHOUT TALEFLY
                                            </div>
                                            <div className="gooseNestSelectDays" >
                                                <div className="gooseNestSelectDaysElement durationselect" id="duration-0" onClick={() => selectDuration(0)} >
                                                    7
                                                </div>
                                                <div className="gooseNestSelectDaysSeparator" >
                                                    |
                                                </div>
                                                <div className="gooseNestSelectDaysElement durationunselect" id="duration-1" onClick={() => selectDuration(1)} >
                                                    30
                                                </div>
                                                <div className="gooseNestSelectDaysSeparator" >
                                                    |
                                                </div>
                                                <div className="gooseNestSelectDaysElement durationunselect" id="duration-2" onClick={() => selectDuration(2)} >
                                                    60
                                                </div>
                                            </div>
                                            <div className="gooseDescriptionFeedButton" >
                                                SELECT DAYS
                                            </div>
                                        </>
                                    ) : (
                                        <div className="gooseDescriptionFeedButtonSmall" >
                                            2 GOLD EGGS
                                            <br/>COLLECT IN 06:24:00:00
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