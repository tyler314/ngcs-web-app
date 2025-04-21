import React from 'react';
import { motion } from "motion/react"
import Header from "../header/Header"
import Footer from "../footer/Footer"
import "./LandingPage.css"

const images = [
    "/dummy-pictures/pic1.jpg",
    "/dummy-pictures/pic2.jpg",
    "/dummy-pictures/pic3.jpg",
    "/dummy-pictures/pic4.jpg"
];


function Title() {
    return (
        <div className="neutral-ground-banner">
            <motion.div
                initial={{ opacity: 0, x: -100 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.8 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                Neutral Ground
            </motion.div>

            <motion.div
                initial={{ opacity: 0, x: 100 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.8 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
            >
                Combat Sports
            </motion.div>
        </div>
    )
}

function InfiniteCarousel() {
    const doubledImages = [...images, ...images];

    return (
        <div className="carousel-container">
            <motion.div
                className="carousel-track"
                animate={{ x: ["0%", "-50%"] }}
                transition={{
                    duration: 50,
                    ease: "linear",
                    repeat: Infinity,
                }}
            >
                {doubledImages.map((src, idx) => (
                    <img
                        src={src}
                        alt={`carousel-${idx}`}
                        className="carousel-image"
                    />
                ))}
            </motion.div>
        </div>
    );
}

export default function LandingPage() {   
    return (
        <div className="landing-page-wrapper">
            <Header/>
            <Title/>
            <img
                className='read-more-artist-image'
                src='/dummy-pictures/banner.jpg'
                alt=''
            />
            <InfiniteCarousel/>
            <Footer/>
        </div>
    )
}