import React from 'react';
import Head from 'next/head';
import { Container, SSRProvider } from 'react-bootstrap';
import { GoogleAnalytics } from "nextjs-google-analytics";

import '../styles/bootstrap.css';
import '../styles/globals.scss';

const MyApp = ({ Component, pageProps }) => {
	return (
		<SSRProvider>
			<Head>
				<meta name="viewport" content="width=device-width, initial-scale=1" />

				{/* HTML Meta Tags */}
				<title>I&apos;m Thanachon | Portfolio</title>
				<meta name="description" content="Explore Thanachon's portfolio, a vibrant showcase of creativity, innovation, and technical skills." />
			</Head>
			<main className="pb-5">
				<GoogleAnalytics
					gaMeasurementId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}
					trackPageViews={{ ignoreHashChange: true }}
				/>
				<Container fluid className="px-0">
					<Component {...pageProps} />
				</Container>
			</main>
		</SSRProvider>
	);
};

export default MyApp;
