import { motion } from "motion/react";
import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import "./Header.css";
import { Menu, IconButton, MenuItem } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import {
  Socials,
  PhoneContact,
  useIsMobile,
  useIsTablet,
} from "../../common/commonUtils";
import { navTabsData } from "../../common/constants";

function NavigationTabs({ className, isHeader, onHomeClick }) {
  const { isMobile } = useIsMobile();
  const { isTablet } = useIsTablet();

  const navTabs = navTabsData.map((tab) => ({
    ...tab,
    className:
      tab.isSpecial && isHeader
        ? `${className}-with-box`
        : className,
  }));

  return isMobile || isTablet ? (
    navTabs.map((item, index) => (
      <MenuItem key={index} className={item.className}>
        <NavLink
          to={item.path}
          exact
          onClick={item.path === "/" ? onHomeClick : undefined}
        >
          {item.label}
        </NavLink>
      </MenuItem>
    ))
  ) : (
    <ul>
      {navTabs.map((item, index) => (
        <li key={index}>
          <NavLink
            to={item.path}
            exact
            className={item.className}
            onClick={item.path === "/" ? onHomeClick : undefined}
          >
            {item.label}
          </NavLink>
        </li>
      ))}
    </ul>
  );
}

function NGLogo({ spinKey, onHomeClick }) {
  const { pathname } = useLocation();
  const isHome = pathname === "/";

  return (
    <div className="ng-logo-header">
      <NavLink to="/" end onClick={onHomeClick}>
        {isHome ? (
          <motion.img
            key={spinKey}
            src="/nglogo192.png"
            alt="Neutral Ground logo"
            width={70}
            height={70}
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1, rotate: 720 }}
            transition={{ type: "spring", stiffness: 50 }}
          />
        ) : (
          <img
            src="/nglogo192.png"
            alt="Neutral Ground logo"
            width={70}
            height={70}
          />
        )}
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

function Banner() {
  return (
    <div className="banner-content">
      <BannerSocialComponent />
    </div>
  );
}

function DesktopHeader({ onHomeClick }) {
  return (
    <div className="desktop-header">
      <NavigationTabs className="desktop-tab" isHeader={true} onHomeClick={onHomeClick} />
    </div>
  );
}

// MOBILE
function MobileHeader({ onHomeClick }) {
  return (
    <div className="mobile-header">
      <ul>
        <li>
          <MobileTitle />
        </li>
        <li>
          <HamburgerDropDown onHomeClick={onHomeClick} />
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

function HamburgerDropDown({ onHomeClick }) {
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
        <NavigationTabs className="mobile-tab" onHomeClick={onHomeClick} />
      </Menu>
    </div>
  );
}

// MAIN
export default function Header() {
  const [spinKey, setSpinKey] = useState(0);
  const onHomeClick = () => setSpinKey((k) => k + 1);

  return (
    <nav>
      <div className="banner">
        <Banner />
      </div>
      <div className="header">
        <NGLogo spinKey={spinKey} onHomeClick={onHomeClick} />
        <MobileHeader onHomeClick={onHomeClick} />
        <DesktopHeader onHomeClick={onHomeClick} />
      </div>
      <div className="lower-banner" />
    </nav>
  );
}
