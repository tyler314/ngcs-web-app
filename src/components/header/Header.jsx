import { motion } from "motion/react"
import React, {useState} from 'react';
import { NavLink } from 'react-router-dom';
import './Header.css'
import { Menu, MenuItem, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';


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
function Banner(props) {
  return (
    <div>

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