import React from "react";
import ShowcaseItem from "./ShowcaseItem";
import StaticImage from "./StaticImage";

const ShowcaseSection = () => {
  return (
    <>
      <ShowcaseItem
        image={
          <StaticImage
            src={"/img/projects/aurapan shop banner 2.webp"}
            alt={"aurapan banner"}
            width={640}
            height={320}
          />
        }
        title={"Aurapan"}
        scale={"Large"}
        headline={"Women's Clothing Online Shop"}
        description={
          <>
            <p>
              <em>Aurapan</em> is a beautiful women&apos;s clothing e-commerce
              website built with <strong>microservices architecture</strong>.
            </p>

            <p>
              The entire app is deployed and runs in <strong>Docker</strong>{" "}
              containers executed in a <strong>Kubernetes</strong> cluster with{" "}
              <strong>Typescript</strong> as a back-end language, performed
              server-side rendering by <strong>Next.js</strong> with
              full-integrated <strong>Stripe</strong> and{" "}
              <strong>Paypal</strong> API payments, developed on{" "}
              <strong>Google Cloud Platform</strong> environment.
            </p>

            <p>
              The project has set CI/CD pipeline with{" "}
              <strong>GitHub Action</strong> workflow and deploying on{" "}
              <strong>DigitalOcean</strong> Kubernetes cluster.
            </p>
          </>
        }
        tagsArray={[
          "Microservices",
          "ReactJS",
          "NextJS",
          "Docker",
          "Kubernetes",
          "TypeScript",
          "MongoDB",
          "Github Action",
        ]}
        demoLink={"https://www.aurapan.com/"}
        githubLink={"https://github.com/thasup/microservices-ecommerce"}
      />

      <ShowcaseItem
        image={
          <StaticImage
            src={"/img/projects/banner suppee.webp"}
            alt={"suppee banner"}
            width={640}
            height={320}
          />
        }
        title={"Suppee"}
        scale={"Large"}
        headline={"Electronics E-Commerce Store"}
        description={
          <p>
            Suppee is an e-commerce platform built with the
            <strong>MERN</strong> stack, creating extensive back-end with{" "}
            <strong>Express</strong>, managing global state with{" "}
            <strong>Redux</strong>, working with a<strong>MongoDB</strong>{" "}
            database and the Mongoose ODM, using{" "}
            <strong>JWT</strong> authentication and integrating the{" "}
            <strong>PayPal</strong> API.
          </p>
        }
        tagsArray={[
          "ReactJS",
          "Redux",
          "Bootstrap",
          "NodeJS",
          "API",
          "MongoDB",
          "Heroku",
        ]}
        demoLink={"https://thasup-suppee.herokuapp.com/"}
        githubLink={"https://github.com/thasup/Suppee"}
      />

      <ShowcaseItem
        image={
          <StaticImage
            src={"/img/projects/preview where should i go banner.webp"}
            alt={"where-should-i-go banner"}
            width={640}
            height={320}
          />
        }
        title={"Where Should I Go?"}
        scale={"Medium"}
        headline={"Travel Companion Application"}
        description={
          <>
            <p>Don&apos;t know where to go?</p>
            <p>
              Why not use this amazing app to find interesting places around
              your area on{" "}
              <strong>google maps</strong> with cool informations from{" "}
              <strong>TripAdvisor</strong> API.
            </p>
          </>
        }
        tagsArray={["ReactJS", "NodeJS", "API", "MUI"]}
        demoLink={"https://thasup-where-should-i-go.netlify.app/"}
        githubLink={"https://github.com/thasup/where-should-i-go"}
      />
    </>
  );
};

export default ShowcaseSection;
