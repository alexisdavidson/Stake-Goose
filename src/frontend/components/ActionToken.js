import { useState, useEffect } from 'react'
import { ethers } from "ethers"
import { Image, Row, Col, Button } from 'react-bootstrap'
import pie from './assets/Pie.png'

const TaleToken = ({buttonLinkOnClick}) => {

    return (
        <Row className="m=auto actionFrame pieDiv">
            <Row className="m-auto textFrame pieDiv">
                <Col className="m-auto pieDiv col-12 col-lg-8">
                    <Image src={pie} className = "pie" />
                </Col>
                <Col className="m-auto pieDiv col-12 col-lg-4">
                    <div className="actionButton" onClick={() => buttonLinkOnClick('uniswapLink')} >
                        UNISWAP
                        <a href="https://app.uniswap.org/#/swap?inputCurrency=ETH&outputCurrency=0x5c0171bd73ab14b0e7de0408f412abfd0365c1d4" target="_blank" id="uniswapLink"></a>
                    </div>
                </Col>
            </Row>
        </Row>
    );
}
export default TaleToken