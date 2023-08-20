import React from "react";

import StaticImage from "./StaticImage";
import Project from "./Project";

const ProjectList = (props) => {
  const { projects } = props;
  return (
    <>
      <Project
        image={
          <StaticImage
            src={"/img/projects/Sentiment Analysis App square 2.png"}
            alt={"Sentiment Analysis App"}
            layout={"fill"}
          />
        }
        title={"Sentiment Analysis App"}
        description={
          <p>
            Single page application that allows users to run Natural Language
            Processing (NLP) on articles or blogs found on other websites.
          </p>
        }
        // tags={["NodeJS", "API", "Bootstrap", "SCSS", "Netlify", "Heroku"]}
        demoLink={"https://thasup-sentiment-analysis.netlify.app/"}
        githubLink={"https://github.com/thasup/sentiment-analysis-app"}
      />
    </>
  );
};

export default ProjectList;
