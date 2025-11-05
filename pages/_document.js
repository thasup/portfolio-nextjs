import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Google Analytics 4 (gtag.js) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-B8YGDMS21X"></script>
        <script
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
        <script
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
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />

        <link rel="icon" href="/favicon.ico" />

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link
          href="https://fonts.googleapis.com/css2?family=Gelasio:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&family=Open+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&family=Quicksand:wght@300;400;500;600;700&display=optional"
          rel="stylesheet"
        />

        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
          integrity="sha512-Fo3rlrZj/k7ujTnHg4CGR2D7kSs0v4LLanw2qksYuRlEzO+tcaEPQogQ0KaoGN26/zrn20ImR1DfuLWnOo7aBA=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />

        {/* Facebook Meta Tags */}
        <meta property="og:url" content="https://thanachon.me" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="I'm Thanachon | Portfolio" />
        <meta
          property="og:description"
          content="Explore Thanachon's portfolio, a vibrant showcase of creativity, innovation, and technical skills."
        />

        <meta
          property="og:image"
          content="https://ogcdn.net/2c2c6737-47d4-4459-9969-e711eb48394c/v1/thanachon.me/I'm%20Thanachon%20%7C%20Portfolio/Explore%20Thanachon's%20portfolio%2C%20a%20vibrant%20showcase%20of%20creativity%2C%20innovation%2C%20and%20technical%20skills./https%3A%2F%2Fopengraph.b-cdn.net%2Fproduction%2Fimages%2F58c47497-c82b-46be-a4aa-7ce92d32f0d4.jpg%3Ftoken%3DvQjX8-eyT3e5s_Rsd8CfvKujFfw-j1O2d2M8SNwdMew%26height%3D800%26width%3D1200%26expires%3D33258829395/og.png"
        />

        {/* Twitter Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content="thanachon.me" />
        <meta property="twitter:url" content="https://thanachon.me" />
        <meta name="twitter:title" content="I'm Thanachon | Portfolio" />
        <meta
          name="twitter:description"
          content="Explore Thanachon's portfolio, a vibrant showcase of creativity, innovation, and technical skills."
        />
        <meta
          name="twitter:image"
          content="https://ogcdn.net/2c2c6737-47d4-4459-9969-e711eb48394c/v1/thanachon.me/I'm%20Thanachon%20%7C%20Portfolio/Explore%20Thanachon's%20portfolio%2C%20a%20vibrant%20showcase%20of%20creativity%2C%20innovation%2C%20and%20technical%20skills./https%3A%2F%2Fopengraph.b-cdn.net%2Fproduction%2Fimages%2F58c47497-c82b-46be-a4aa-7ce92d32f0d4.jpg%3Ftoken%3DvQjX8-eyT3e5s_Rsd8CfvKujFfw-j1O2d2M8SNwdMew%26height%3D800%26width%3D1200%26expires%3D33258829395/og.png"
        />
      </Head>

      <body>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-54V2W36"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <Main />
        <NextScript />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(){if(!window.chatbase||window.chatbase("getState")!=="initialized"){window.chatbase=(...arguments)=>{if(!window.chatbase.q){window.chatbase.q=[]}window.chatbase.q.push(arguments)};window.chatbase=new Proxy(window.chatbase,{get(target,prop){if(prop==="q"){return target.q}return(...args)=>target(prop,...args)}})}const onLoad=function(){const script=document.createElement("script");script.src="https://www.chatbase.co/embed.min.js";script.id="SQ1VBlgBzBeo7ILruCJYx";script.domain="www.chatbase.co";document.body.appendChild(script)};if(document.readyState==="complete"){onLoad()}else{window.addEventListener("load",onLoad)}})();
            `
          }}
        />
      </body>
    </Html>
  );
}
