import "./Footer.css";
import Stack from "@mui/material/Stack";
import {
  Socials,
  PhoneContact,
  useContactInfo,
} from "../../common/commonUtils";
import PlaceIcon from "@mui/icons-material/Place";
import { navTabsData } from "../../common/constants";
import { NavLink } from "react-router-dom";

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
  const { contactInfo } = useContactInfo();

  if (!contactInfo) return null;

  return (
    <Stack direction="row" spacing={1} alignItems="left">
      <PlaceIcon />
      <div className="footer-desktop-view">
        <a href={contactInfo.address.googleMapsLink} className="footer-address">
          {contactInfo.address.full}
        </a>
      </div>
      <div className="footer-mobile-view">
        <a href={contactInfo.address.googleMapsLink} className="footer-address">
          {contactInfo.address.street}, <br />
          {contactInfo.address.city}, {contactInfo.address.state}{" "}
          {contactInfo.address.zip}
        </a>
      </div>
    </Stack>
  );
}

function AddressAndSocials() {
  const { contactInfo } = useContactInfo();

  if (!contactInfo) return null;

  return (
    <Stack
      direction="column"
      spacing={1}
      alignItems="center"
      className="footer-nav-link"
    >
      <div className="footer-desktop-view">{contactInfo.businessName}</div>
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
