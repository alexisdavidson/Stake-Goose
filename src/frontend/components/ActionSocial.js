import { useState, useEffect } from 'react'
import { ethers } from "ethers"
import { Image, Row, Col, Button } from 'react-bootstrap'

const Social = () => {

    return (
        <Row className="actionFrame">
            <Row className="mx-auto textFrame">
                <div className="">SOCIAL</div>
            </Row>
            <Row className="mx-auto mt-0 mb-4 textFrame">
                <div className="">TWITTER
                <br/>DISCORD
                <br/>CHAPTER 1 BEANSTALKER
                <br/>ABOUT US
                </div>
            </Row>
        </Row>
    );
}
export default Social