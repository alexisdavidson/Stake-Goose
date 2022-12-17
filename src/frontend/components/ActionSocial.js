import { useState, useEffect } from 'react'
import { ethers } from "ethers"
import { Image, Row, Col, Button } from 'react-bootstrap'

const Social = () => {

    return (
        <Row className="actionFrame">
            <Row className="mx-auto textFrame">
                <div className="actionTitle">SOCIAL</div>
            </Row>
            <Row className="mx-auto mt-0 mb-4 textFrame">
                <div className="actionDescription"><a href="https://www.twitter.com/goosebumperxyz" className="socialLink" target="_blank">TWITTER</a>
                <br/><a href="https://discord.gg/taletinker" className="socialLink" target="_blank">DISCORD</a>
                <br/><a href="https://www.beanstalker.xyz" className="socialLink" target="_blank">CHAPTER 1 BEANSTALKER</a>
                <br/><a href="https://www.taletinker.com" className="socialLink" target="_blank">ABOUT US</a>
                </div>
            </Row>
        </Row>
    );
}
export default Social