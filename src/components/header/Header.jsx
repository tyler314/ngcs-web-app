import { motion } from "motion/react";
import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import "./Header.css";
import { Menu, MenuItem, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Socials, PhoneContact } from "../../common/commonUtils";

function NGLogo() {
  return (
    <div className="ng-logo-header">
      <NavLink to="/" exact>
        <motion.img
          src="/nglogo192.png"
          alt=""
          width={70}
          height={70}
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1, rotate: 720 }}
          transition={{ type: "spring", stiffness: 50 }}
        />
      </NavLink>
    </div>
  );
}

// DESKTOP
function BannerSocialComponent() {
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  useEffect(() => {
    const checkScreenSize = () => {
      setIsLargeScreen(window.innerWidth > 650);
    };

    checkScreenSize(); // initial check
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);
  return (
    <div className="banner-social">
      <Socials className="header-social-stack" />
      {isLargeScreen && <div className="banner-nav-link">|</div>}
      <PhoneContact
        displayPhoneNumber={true}
        className="phone-contact-desktop"
      />
      <PhoneContact
        displayPhoneNumber={false}
        className="phone-contact-mobile"
      />
    </div>
  );
}

function TrialButtonHeader() {
  return (
    <div className="banner-waiver">
      <NavLink to="/free-trial" className="banner-nav-link">
        Click Here for a Free Week Trial
      </NavLink>
    </div>
  );
}
function Banner() {
  return (
    <div className="banner-content">
      <TrialButtonHeader />
      <BannerSocialComponent />
    </div>
  );
}

function DesktopHeader() {
  return (
    <div className="desktop-header">
      <ul>
        <li>
          <DesktopTab label="About Us" className="desktop-tab" />
        </li>
        <li>
          <DesktopTab label="Programs" className="desktop-tab" />
        </li>
        <li>
          <DesktopTab label="Schedule" className="desktop-tab" />
        </li>
        <li>
          <DesktopTab label="Instructors" className="desktop-tab" />
        </li>
        <li>
          <DesktopTab label="CONTACT US" className="desktop-tab-with-box" />
        </li>
      </ul>
    </div>
  );
}

function DesktopTab(props) {
  return (
    <NavLink to="/" exact className={props.className}>
      {props.label}
    </NavLink>
  );
}

// MOBILE
function MobileHeader() {
  return (
    <div className="mobile-header">
      <ul>
        <li>
          <MobileTitle />
        </li>
        <li>
          <HamburgerDropDown />
        </li>
      </ul>
    </div>
  );
}

function MobileTitle() {
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 420);
    };

    checkScreenSize(); // initial check
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  return (
    <div className="mobile-title">
      Neutral Ground {isSmallScreen && <br />} Combat Sports
    </div>
  );
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
    <div className="hamburger-drop-down">
      {
        <IconButton onClick={openMenu}>
          <MenuIcon />
        </IconButton>
      }
      <Menu
        open={Boolean(anchor)}
        anchorEl={anchor}
        onClose={closeMenu}
        keepMounted
      >
        <MenuItem className="mobile-tab">
          <NavLink to="/" exact>
            About
          </NavLink>
        </MenuItem>
        <MenuItem className="mobile-tab">
          <NavLink to="/" exact>
            Schedule
          </NavLink>
        </MenuItem>
        <MenuItem className="mobile-tab">
          <NavLink to="/" exact>
            Programs
          </NavLink>
        </MenuItem>
        <MenuItem className="mobile-tab">
          <NavLink to="/" exact>
            Instructors
          </NavLink>
        </MenuItem>
      </Menu>
    </div>
  );
}

// MAIN
export default function Header() {
  return (
    <nav>
      <div className="banner">
        <Banner />
      </div>
      <div className="header">
        <NGLogo />
        <MobileHeader />
        <DesktopHeader />
      </div>
      <div className="lower-banner" />
    </nav>
  );
}
