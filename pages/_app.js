import React from 'react';
import Head from 'next/head';
import { Container, SSRProvider } from 'react-bootstrap';
import Script from 'next/script';

import '@/styles/bootstrap.css';
import '@/styles/globals.scss';

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
				<Container fluid className="px-0">
					<Component {...pageProps} />
				</Container>
				<Script
					src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"
					strategy="lazyOnload"
				/>
			</main>
		</SSRProvider>
	);
};

export default MyApp;
