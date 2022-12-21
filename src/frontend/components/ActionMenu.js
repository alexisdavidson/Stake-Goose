import { useState, useEffect } from 'react'
import { ethers } from "ethers"
import { Image, Row, Col, Button } from 'react-bootstrap'

const Menu = ({toggleMenu, buttonLinkOnClick, timeleft}) => {

    return (
        <Row className="actionFrame">
            <Row className="m-0 p-0">
                <Row className="m-0 p-0">
                    <div className="mobileMenuButton" onClick={() => buttonLinkOnClick('openseaLink')}>OPENSEA</div>
                </Row>
                <Row className="m-0 p-0">
                    <div className="mobileMenuButton" onClick={() => toggleMenu(4, timeleft == null)}>NEST</div>
                </Row>
                <Row className="m-0 p-0">
                    <div className="mobileMenuButton" onClick={() => toggleMenu(5, timeleft == null)}>FEED A BEAN</div>
                </Row>
                <Row className="m-0 p-0">
                    <div className="mobileMenuButton" onClick={() => toggleMenu(7)}>TALE TOKEN</div>
                </Row>
                <Row className="m-0 p-0">
                    <div className="mobileMenuButton" onClick={() => toggleMenu(2)}>HOW TO</div>
                </Row>
                <Row className="m-0 p-0">
                    <div className="mobileMenuButton" onClick={() => toggleMenu(6)}>SOCIAL</div>
                </Row>
            </Row>
        </Row>
    );
}
export default Menu