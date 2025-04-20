import React from 'react';
import { motion } from "motion/react"
import Header from "../header/Header"
import Footer from "../footer/Footer"
import "./LandingPage.css"


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

export default function LandingPage() {   
    return (
        <div className="landing-page-wrapper">
            <Header/>
            <Title/>
            <Footer/>
        </div>
    )
}