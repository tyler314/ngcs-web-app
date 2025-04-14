import "./commonUtils.css"
import {NavLink} from "react-router-dom";
import FacebookOutlinedIcon from "@mui/icons-material/FacebookOutlined";
import InstagramIcon from "@mui/icons-material/Instagram";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import Stack from "@mui/material/Stack";
import React from "react";

function Socials(props) {
    return (
        <Stack direction="row" spacing={1} alignItems="flex-start" className={props.className}>
            <NavLink to="https://www.facebook.com/profile.php?id=100057586954258" exact className="social-nav-link">
                <FacebookOutlinedIcon/>
            </NavLink>
            <NavLink to="https://www.instagram.com/neutralgroundcombatsports/" exact className="social-nav-link">
                <InstagramIcon/>
            </NavLink>
            <a href={"mailto:info@westbendbjj.com"} className="social-nav-link">
                <EmailOutlinedIcon/>
            </a>
        </Stack>
    )
}

function PhoneContact({ displayPhoneNumber = true, className }) {
    return (
        <div className={className}>
            <Stack direction="row" spacing={1} alignItems="center" className="social-nav-link">
                <PhoneOutlinedIcon/>
                <div
                    className='header-phone-number'
                    style={{ display: displayPhoneNumber ? "block" : "none" }}
                >
                    262-335-8020
                </div>
            </Stack>
        </div>
    )
}

export {
    Socials,
    PhoneContact
}