import React from 'react';
import type { Metadata } from 'next';
import Script from 'next/script';

import '@/styles/bootstrap.css';
import '@/styles/globals.scss';

export const metadata: Metadata = {
  title: "I'm Thanachon | Portfolio",
  description: "Explore Thanachon's portfolio, a vibrant showcase of creativity, innovation, and technical skills.",
  openGraph: {
    type: "website",
    url: "https://thanachon.me",
    title: "I'm Thanachon | Portfolio",
    description: "Explore Thanachon's portfolio, a vibrant showcase of creativity, innovation, and technical skills.",
    images: [
      {
        url: "https://ogcdn.net/2c2c6737-47d4-4459-9969-e711eb48394c/v1/thanachon.me/I'm%20Thanachon%20%7C%20Portfolio/Explore%20Thanachon's%20portfolio%2C%20a%20vibrant%20showcase%20of%20creativity%2C%20innovation%2C%20and%20technical%20skills./https%3A%2F%2Fopengraph.b-cdn.net%2Fproduction%2Fimages%2F58c47497-c82b-46be-a4aa-7ce92d32f0d4.jpg%3Ftoken%3DvQjX8-eyT3e5s_Rsd8CfvKujFfw-j1O2d2M8SNwdMew%26height%3D800%26width%3D1200%26expires%3D33258829395/og.png"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    site: "thanachon.me",
    title: "I'm Thanachon | Portfolio",
    description: "Explore Thanachon's portfolio, a vibrant showcase of creativity, innovation, and technical skills.",
    images: ["https://ogcdn.net/2c2c6737-47d4-4459-9969-e711eb48394c/v1/thanachon.me/I'm%20Thanachon%20%7C%20Portfolio/Explore%20Thanachon's%20portfolio%2C%20a%20vibrant%20showcase%20of%20creativity%2C%20innovation%2C%20and%20technical%20skills./https%3A%2F%2Fopengraph.b-cdn.net%2Fproduction%2Fimages%2F58c47497-c82b-46be-a4aa-7ce92d32f0d4.jpg%3Ftoken%3DvQjX8-eyT3e5s_Rsd8CfvKujFfw-j1O2d2M8SNwdMew%26height%3D800%26width%3D1200%26expires%3D33258829395/og.png"]
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-54V2W36"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        
        <main className="pb-5">
          <div className="container-fluid px-0">
            {children}
          </div>
        </main>
        
        {/* Google Analytics 4 (gtag.js) */}
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-B8YGDMS21X" strategy="afterInteractive" />
        <Script
          id="gtag-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
             __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-B8YGDMS21X');
            `
          }}
        />
        {/* Google Tag Manager */}
        <Script
          id="gtm-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
             __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-54V2W36');
             `
          }}
        />

        <Script
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"
          strategy="lazyOnload"
        />
        <Script
          id="chatbase-init"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
             __html: `
              (function(){if(!window.chatbase||window.chatbase("getState")!=="initialized"){window.chatbase=(...arguments)=>{if(!window.chatbase.q){window.chatbase.q=[]}window.chatbase.q.push(arguments)};window.chatbase=new Proxy(window.chatbase,{get(target,prop){if(prop==="q"){return target.q}return(...args)=>target(prop,...args)}})}const onLoad=function(){const script=document.createElement("script");script.src="https://www.chatbase.co/embed.min.js";script.id="SQ1VBlgBzBeo7ILruCJYx";script.domain="www.chatbase.co";document.body.appendChild(script)};if(document.readyState==="complete"){onLoad()}else{window.addEventListener("load",onLoad)}})();
            `
          }}
        />
      </body>
    </html>
  );
}
