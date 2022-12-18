import { useState, useEffect } from 'react'
import { ethers } from "ethers"
import { Image, Row, Col, Button } from 'react-bootstrap'
import getTimeLeftString from './TimeOperation'
import goose from './assets/Goose.png'

const Nest = ({timeleft}) => {
    const [duration, setDuration] = useState(0)
    let justNested = false
    
    const stakeGoose = (useTalefly) => {
        console.log("StakeGoose button", useTalefly, duration)
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
                        <Col className="m-auto gooseDiv col-12 col-lg-6">
                            <Image src={goose} className = "gooseImg" />
                            <div className="gooseDescription mb-2" >
                                GOOSE #0001
                                <br/>EGG: GOLD
                            </div>
                        </Col>
                        <Col className="m-auto col-12 col-lg-6">
                            {!justNested ? (
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