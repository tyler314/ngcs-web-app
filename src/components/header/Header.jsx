import { motion } from "motion/react"
import React, {useState} from 'react';
import { NavLink } from 'react-router-dom';
import './Header.css'
import {Menu, MenuItem, IconButton} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import FacebookOutlinedIcon from '@mui/icons-material/FacebookOutlined';
import InstagramIcon from '@mui/icons-material/Instagram';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import Stack from "@mui/material/Stack";


function NGLogo() {
  return (
    <div className="ng-logo-header">
    <NavLink
      to="/" exact>
        <motion.img
          src="/nglogo192.png"
          alt=""
          width={70}
          height={70}
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1, rotate: 720 }}
          transition={{ type: 'spring', stiffness: 50}}/>
    </NavLink>
    </div>
  )
}
// DESKTOP
function BannerSocialComponent() {
    return (
        <div className='banner-social'>
            <NavLink to="https://www.facebook.com/profile.php?id=100057586954258" exact className="banner-nav-link">
                <FacebookOutlinedIcon/>
            </NavLink>
            <NavLink to="https://www.instagram.com/neutralgroundcombatsports/" exact className="banner-nav-link">
                <InstagramIcon/>
            </NavLink>
            <a href={'mailto:info@westbendbjj.com'} className="banner-nav-link">
                <EmailOutlinedIcon/>
            </a>
            <div className="banner-nav-link">|</div>
            <Stack direction="row" spacing={1} alignItems="center" className="banner-nav-link">
                <PhoneOutlinedIcon/>
                <div className='phone-number'>262-335-8020</div>
            </Stack>
        </div>
    )
}

function WaiverLinkComponent() {
    return (
        <div className='banner-waiver'>
            <NavLink
                to="https://ngwb-public-forms.s3.us-east-2.amazonaws.com/GymWaiver.pdf" exact
                className='banner-nav-link'>
                Click Here to Sign Our Waiver
            </NavLink>
        </div>
    )
}
function Banner() {
  return (
    <div className="banner-content">
        <WaiverLinkComponent/>
        <BannerSocialComponent/>
    </div>
  )
}

function DesktopHeader() {
  return (
    <div className='desktop-header'>
      <ul>
        <li>
          <DesktopTab
            label="About Us"
            className="desktop-tab"
          />
        </li>
        <li>
          <DesktopTab
            label="Programs"
            className="desktop-tab"
          />
        </li>
        <li>
          <DesktopTab
            label="Schedule"
            className="desktop-tab"
          />
        </li>
        <li>
          <DesktopTab
            label="Instructors"
            className="desktop-tab"
          />
        </li>
        <li>
          <DesktopTab
            label="CONTACT US"
            className="desktop-tab-with-box"
          />
        </li>
      </ul>
    </div>
  )
}

function DesktopTab(props) {
  return (
    <NavLink
      to="/" exact
      className={props.className}>
        { props.label }
    </NavLink>
  )
}

// MOBILE
function MobileHeader() {
  return (
    <div className='mobile-header'>
      <ul>
        <li>
          <MobileTitle/>
        </li>
        <li>
          <HamburgerDropDown/>
        </li>
      </ul>
    </div>
  )
}

function MobileTitle() {
  return (
      <div className="mobile-title"> 
          Neutral Ground West Bend
      </div>
  )
}

function HamburgerDropDown() {

  const [anchor, setAnchor] = useState(null);

  const openMenu = (event) => {
    setAnchor(event.currentTarget);
  };
  const closeMenu = () => {
    setAnchor(null);
  };

  return (
          <div className='hamburger-drop-down'>
            {
              <IconButton onClick={openMenu}>
               <MenuIcon/>
             </IconButton>
            }
            <Menu
              open={Boolean(anchor)}
              anchorEl={anchor}
              onClose={closeMenu}
              keepMounted
            >
            <MenuItem className='mobile-tab'>
              <NavLink to="/" exact>
                About
              </NavLink>
            </MenuItem>
            <MenuItem className='mobile-tab'>
              <NavLink to="/" exact>
                Schedule
              </NavLink>
            </MenuItem>
            <MenuItem className='mobile-tab'> 
              <NavLink to="/" exact>
                Programs
              </NavLink>
            </MenuItem>
            <MenuItem className='mobile-tab'> 
              <NavLink to="/" exact>
                Instructors
              </NavLink>
            </MenuItem>
            </Menu>
          </div>
        )
}

// MAIN
export default function Header() {
  return (
    <nav>
      <div className="banner">
        <Banner/>
      </div>
      <div className="header">
          <NGLogo/>
          <MobileHeader/>
          <DesktopHeader/>
      </div>
    </nav>
)
}