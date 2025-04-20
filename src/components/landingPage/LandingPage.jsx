import React from 'react';
import Header from "../header/Header"
import Footer from "../footer/Footer"
import "./LandingPage.css"


function Title() {
    return (
        <div className="neutral-ground-banner">
            Neutral Ground<br/>Combat Sports
        </div>
    )
}

export default function LandingPage() {   
    return (
        <div className="landing-page-wrapper">
            <Header/>
            <Title/>
            <Footer/>
        </div>
    )
}