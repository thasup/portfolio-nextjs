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

				{/* HTML Meta Tags */}
				<title>I&apos;m Thanachon | Portfolio</title>
				<meta name="description" content="Explore Thanachon's portfolio, a vibrant showcase of creativity, innovation, and technical skills." />

				{/* Facebook Meta Tags */}
				<meta property="og:url" content="https://thanachon.me" />
				<meta property="og:type" content="website" />
				<meta property="og:title" content="I'm Thanachon | Portfolio" />
				<meta property="og:description" content="Explore Thanachon's portfolio, a vibrant showcase of creativity, innovation, and technical skills." />

				<meta property="og:image" content="https://ogcdn.net/2c2c6737-47d4-4459-9969-e711eb48394c/v1/thanachon.me/I'm%20Thanachon%20%7C%20Portfolio/Explore%20Thanachon's%20portfolio%2C%20a%20vibrant%20showcase%20of%20creativity%2C%20innovation%2C%20and%20technical%20skills./https%3A%2F%2Fopengraph.b-cdn.net%2Fproduction%2Fimages%2F58c47497-c82b-46be-a4aa-7ce92d32f0d4.jpg%3Ftoken%3DvQjX8-eyT3e5s_Rsd8CfvKujFfw-j1O2d2M8SNwdMew%26height%3D800%26width%3D1200%26expires%3D33258829395/og.png" />

				{/* Twitter Meta Tags */}
				<meta name="twitter:card" content="summary_large_image" />
				<meta property="twitter:domain" content="thanachon.me" />
				<meta property="twitter:url" content="https://thanachon.me" />
				<meta name="twitter:title" content="I'm Thanachon | Portfolio" />
				<meta name="twitter:description" content="Explore Thanachon's portfolio, a vibrant showcase of creativity, innovation, and technical skills." />
				<meta name="twitter:image" content="https://ogcdn.net/2c2c6737-47d4-4459-9969-e711eb48394c/v1/thanachon.me/I'm%20Thanachon%20%7C%20Portfolio/Explore%20Thanachon's%20portfolio%2C%20a%20vibrant%20showcase%20of%20creativity%2C%20innovation%2C%20and%20technical%20skills./https%3A%2F%2Fopengraph.b-cdn.net%2Fproduction%2Fimages%2F58c47497-c82b-46be-a4aa-7ce92d32f0d4.jpg%3Ftoken%3DvQjX8-eyT3e5s_Rsd8CfvKujFfw-j1O2d2M8SNwdMew%26height%3D800%26width%3D1200%26expires%3D33258829395/og.png" />
			</Head>
			<main className="pb-5">
				<Container fluid className="px-0">
					<Component {...pageProps} />
				</Container>
			</main>
		</SSRProvider>
	);
};

export default MyApp;
