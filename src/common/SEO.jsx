import React from "react";
import { Helmet } from "react-helmet-async";

export default function SEO({ title, description, type, name, canonical }) {
    return (
        <Helmet>
            {/* Standard metadata tags */}
            <title>{title}</title>
            <meta name="description" content={description} />
            {canonical && <link rel="canonical" href={canonical} />}

            {/* End standard metadata tags */}

            {/* Facebook tags */}
            <meta property="og:type" content={type} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            {/* End Facebook tags */}

            {/* Twitter tags */}
            <meta name="twitter:creator" content={name} />
            <meta name="twitter:card" content={type} />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            {/* End Twitter tags */}
        </Helmet>
    );
}

SEO.defaultProps = {
    title: "Neutral Ground Combat Sports",
    description:
        "West Bend, Wisconsin's premier martial arts academy offering Brazilian Jiu-Jitsu, MMA, Kickboxing, and Boxing classes for all skill levels.",
    type: "website",
    name: "Neutral Ground Combat Sports",
    canonical: "https://www.westbendbjj.com",
};
