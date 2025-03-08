import React from 'react';
import Stack from '@mui/material/Stack';
import Header from "../header/Header"
import Footer from "../footer/Footer"
import "./LandingPage.css"
import img1 from '../../img/landing-page-1.jpg';

function Title(props) {
    return (
        <div>
            <h1 className={props.className}>
                <div className={props.isDesktop ? 'hide' : ''}>
                        Neutral Ground
                    <br/>
                    West Bend
                </div>
            </h1>
        </div>
    )
}

function WelcomeContainer() {

    return (
        <div className="welcome-message-landing-page">
            <p class="welcome-message-text-landing-page">
                <div className='welcome-message-header-text-landing-page'>
                    NEUTRAL GROUND COMBAT SPORTS
                </div>
                <br/>
                Since 2005, Neutral Ground has been Wisconsin's premier martial arts & functional fitness academy.  With multiple locations across the state, we are excited to grow our family in our new space in West Bend, WI.
                <br/>
                Neutral Ground West Bend offers Brazilian Jiu Jitsu, MMA, Performance Fitness, and Kickboxing instruction.  Our comprehensive martial arts programs will allow you to train among like-minded and supportive fellow students in an exciting, vibrant, and uplifting environment that is as challenging as you make it.   Our goal is to help you take your training to the next level, whatever that may be.
                <br/>
                <br/><br/>
                <div className='welcome-message-sub-header-text-landing-page'>
                    NEW MATS and Facility Updates!
                </div>
            </p>
        </div>
    )
}

export default function LandingPage() {   
    return (
        <div className="landing-page-wrapper">
            <Header/>
                <div className='welcome-message-container-desktop'>
                    <Stack direction="row" spacing={1}>
                        <WelcomeContainer/>
                        <img
                            className='main-img-landing-page-desktop'
                            src={img1}
                            alt=""
                        />
                    </Stack>
                </div>
                <div className='welcome-message-container-mobile'>
                    <Title
                        className='title-header-landing-page-mini' 
                        isDesktop={false}
                    />
                    <Stack direction="column" spacing={1}>
                        <WelcomeContainer/>
                        <div className='mid-size-landing-page-image'>
                            <div className='main-img-landing-page'>
                                <img
                                    src={img1}
                                    className='image-styling'
                                    alt=""
                                />
                            </div>
                        </div>
                    </Stack>
                </div>
            <Footer/>
        </div>
    )
}