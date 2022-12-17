import { useState, useEffect } from 'react'
import { ethers } from "ethers"
import { Image, Row, Col, Button } from 'react-bootstrap'

const Social = () => {

    return (
        <Row className="actionFrame">
            <Row className="mx-auto textFrame mb-4">
                <div className="actionTitle">SOCIAL</div>
            </Row>
            <Row className="mx-auto mt-0 textFrame">
                <div className="actionDescription actionDescriptionBig mt-4">
                    <div className="socialLink"><a href="https://www.twitter.com/goosebumperxyz" target="_blank">TWITTER</a></div>
                    <div className="socialLink"><a href="https://discord.gg/taletinker" target="_blank">DISCORD</a></div>
                    <div className="socialLink"><a href="https://www.beanstalker.xyz" target="_blank">CHAPTER 1 BEANSTALKER</a></div>
                    <div className="socialLink"><a href="https://www.taletinker.com" target="_blank">ABOUT US</a></div>
                </div>
            </Row>
        </Row>
    );
}
export default Social