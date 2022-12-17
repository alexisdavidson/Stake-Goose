import { useState, useEffect } from 'react'
import { ethers } from "ethers"
import { Image, Row, Col, Button } from 'react-bootstrap'

const HowTo = () => {

    return (
        <Row className="actionFrame">
            <Row className="actionFrameScroll">
                <Row className="mx-auto textFrame">
                    <div className="actionTitle">HOW TO GOOSEBUMPER</div>
                </Row>
                <Row className="mx-auto mt-0 mb-4 textFrame">
                    <div className="actionDescription actionDescriptionLeft">1. STAKE GOOSE, LAY EGGS BUT BEWARE OF THE WOLF 
                    <br/>2. 1 SILVER EGG = 1 $TALE & 1 GOLD EGG = 3 $TALE 
                    <br/>3. FEED A BEAN TO THE GOOSE & IT LAYS GOLD EGGS 
                    <br/>4. THE WOLF WILL EAT YOUR GOOSE & EGGS BUT YOU CAN PREVENT THAT
                    <br/>5. CONVERT TALE TOKEN TO TALEFLY TO FEND OFF THE WOLF 
                    <br/>6. STAKING REWARDS: 
                    <br/>
                    <br/>OPTION A 7 DAYS = 7 EGGS 
                    <br/>OPTION B 30 DAYS = 35 EGGS 
                    <br/>OPTION C 60 DAYS = 80 EGGS 
                    <br/>
                    <br/>7. CONVERT 1 $TALE FOR 1 TALEFLY (OPTIONAL 🐺) 
                    <br/>
                    <br/>OPTION A 7 DAYS = 5 TALEFLY (5 $TALE) 
                    <br/>OPTION B 30 DAYS = 15 TALEFLY (15 $TALE) 
                    <br/>OPTION C 60 DAYS = 25 TALEFLY (25 $TALE)
                    </div>
                </Row>
            </Row>
        </Row>
    );
}
export default HowTo