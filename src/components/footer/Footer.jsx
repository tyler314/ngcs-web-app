import React from 'react';
import './Footer.css'
import Stack from "@mui/material/Stack";
import { Socials, PhoneContact } from "../../common/commonUtils";
import PlaceIcon from '@mui/icons-material/Place';

function NGLogo() {
  return (
    <div className="ng-logo-footer">
        <img
          src="/nglogo192.png"
          alt=""
          width={200}
          height={200}
        />
    </div>
  )
}

function PageNavStack() {

    return (
        <div className="footer-nav-stack">
            <div>
                About Us
            </div>
            <div>
                Programs
            </div>
            <div>
                Schedule
            </div>
            <div>
                Instructors
            </div>
            <div>
                Contact Us
            </div>
        </div>
    )
}

function AddressContact() {
    return (
        <Stack direction="row" spacing={1} alignItems="left">
            <PlaceIcon/>
            <a href="https://maps.google.com/?q=Neutral+Ground+West+Bend" className='footer-address'>
                7003 State Hwy 144, Barton, WI 53090
            </a>
            <a href="https://maps.google.com/?q=Neutral+Ground+West+Bend" className='footer-address-mobile'>
                7003 State Hwy 144, <br/> Barton, WI 53090
            </a>
        </Stack>
    )
}

function AddressAndSocials() {
    return (
        <Stack direction="column" spacing={1} alignItems="left" className="footer-nav-link">
            <div className="left-align">Neutral Ground West Bend</div>
            <PhoneContact/>
            <AddressContact/>
            <Socials/>
        </Stack>
    )
}

function FooterStack(props) {
    return (
        <div className={props.className}>
            <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                className={props.className}
            >
                <NGLogo />
                <Stack direction="row" alignItems="center" className="footer-inner-stack">
                    <PageNavStack />
                    <AddressAndSocials />
                </Stack>
            </Stack>
        </div>
    )
}

export default function Footer() {
  
    return (
      <footer className='footer'>
          <FooterStack className="footer-outer-stack-desktop"/>
          <FooterStack className="footer-outer-stack-mobile" />
      </footer>
    )
  }