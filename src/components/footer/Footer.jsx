import "./Footer.css";
import Stack from "@mui/material/Stack";
import { Socials, PhoneContact } from "../../common/commonUtils";
import PlaceIcon from "@mui/icons-material/Place";
import { navTabsData } from "../../common/constants";
import { NavLink } from "react-router-dom";
import React from "react";

function NGLogo() {
  return (
    <div className="ng-logo-footer">
      <img src="/nglogo192.png" alt="" width={200} height={200} />
    </div>
  );
}

function PageNavStack() {
  const navTabs = navTabsData.map((tab) => ({
    ...tab,
    className: "footer-tab",
  }));
  return (
    <div className="footer-nav-stack">
      <ul>
        {navTabs.map((item, index) => (
          <li key={index}>
            <NavLink to={item.path} exact className={item.className}>
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
}

function AddressContact() {
  return (
    <Stack direction="row" spacing={1} alignItems="left">
      <PlaceIcon />
      <div className="footer-desktop-view">
        <a
          href="https://maps.google.com/?q=Neutral+Ground+West+Bend"
          className="footer-address"
        >
          7003 State Hwy 144, West Bend, WI 53090
        </a>
      </div>
      <div className="footer-mobile-view">
        <a
          href="https://maps.google.com/?q=Neutral+Ground+West+Bend"
          className="footer-address"
        >
          7003 State Hwy 144, <br /> West Bend, WI 53090
        </a>
      </div>
    </Stack>
  );
}

function AddressAndSocials() {
  return (
    <Stack
      direction="column"
      spacing={1}
      alignItems="center"
      className="footer-nav-link"
    >
      <div className="footer-desktop-view">Neutral Ground Combat Sports</div>
      <div className="footer-mobile-view">
        Neutral Ground <br /> Combat Sports
      </div>
      <PhoneContact />
      <AddressContact />
      <Socials />
    </Stack>
  );
}

function FooterStackDesktop(props) {
  return (
    <div className={props.className}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        className={props.className}
      >
        <NGLogo />
        <Stack
          direction="row"
          alignItems="center"
          className="footer-inner-stack"
        >
          <PageNavStack />
          <AddressAndSocials />
        </Stack>
      </Stack>
    </div>
  );
}

function FooterStackMobile(props) {
  return (
    <div className={props.className}>
      <Stack
        direction="column"
        alignItems="center"
        justifyContent="space-between"
        className={props.className}
      >
        <NGLogo />
        <PageNavStack />
        <AddressAndSocials />
      </Stack>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="footer">
      <FooterStackDesktop className="footer-outer-stack-desktop" />
      <FooterStackMobile className="footer-outer-stack-mobile" />
    </footer>
  );
}
