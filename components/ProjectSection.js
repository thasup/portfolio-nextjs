import React from 'react'
import { data as projectsData} from "../data/projects.json";
import ProjectItem from './ProjectItem';
import StaticImage from './StaticImage';

const ProjectSection = () => {
  return (
      <>
        {
          projectsData.projects.map(project => {
            return (
              <ProjectItem
                key={project.name}
                image={
                  <StaticImage
                    src={project.imageSrc}
                    alt={project.name}
                    width={400}
                    height={400}
                  />
                }
                title={project.name}
                description={project.description}
                tags={project.tags}
                demoLink={project.demoLink}
                githubLink={project.githubLink}
              />
            )
          })
        }
      </>
  )
}

export default ProjectSection