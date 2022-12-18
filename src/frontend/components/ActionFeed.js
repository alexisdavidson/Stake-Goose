import { useState, useEffect } from 'react'
import { ethers } from "ethers"
import { Image, Row, Col, Button } from 'react-bootstrap'
import getTimeLeftString from './TimeOperation'

const Nest = ({timeleft}) => {

    return (
        <Row className="actionFrame">
            <Row className="mx-auto textFrame">
                <div className="actionTitle">FEED A BEAN</div>
            </Row>
            <Row className="mx-auto mt-0 mb-4 textFrame">
                {!timeleft ? (
                    <div className="actionDescription actionDescriptionBig">Go.
                    </div>
                ) : (
                    <div className="actionDescription actionDescriptionBig">LIVE IN {getTimeLeftString(timeleft)}
                    </div>
                )}
            </Row>
        </Row>
    );
}
export default Nest