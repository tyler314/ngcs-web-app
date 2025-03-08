import React from 'react';
import './Footer.css'

function NGLogo() {
  return (
    <div className="ng-logo-footer">
        <img
          src="/nglogo192.png"
          alt=""
          width={70}
          height={70}
        />
    </div>
  )
}

export default function Footer() {
  
    return (
      <footer className='footer'>
        <NGLogo/>
        <div className='footer-container'/>
      </footer>
    )
  }