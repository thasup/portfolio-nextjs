import React from 'react';
import Head from 'next/head';
import { Container, SSRProvider } from 'react-bootstrap';

import '../styles/bootstrap.css';
import '../styles/globals.scss';

const MyApp = ({ Component, pageProps }) => {
	return (
		<SSRProvider>
			<Head>
				<meta name="viewport" content="width=device-width, initial-scale=1" />
			</Head>
			{/* <CustomHeader currentUser={currentUser} {...pageProps} /> */}
			<main className="pb-5">
				<Container fluid className="px-0">
					<Component {...pageProps} />
				</Container>
			</main>
			{/* <Footer /> */}
		</SSRProvider>
	);
};

export default MyApp;
