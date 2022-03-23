import React from "react";
import Image from "next/image";

const AboutMe = () => {
  const myLoader = ({ src, width, quality }) => {
    return `${src}&w=${width}&q=${quality || 75}`;
  };

  return (
    <section id="about" className="section-container section-bg">
      <div className="container">
        <h2 className="text-start">About Me</h2>

        <div className="row mt-5">
          <div className="col-md-4">
            <div className="profile-image d-flex justify-content-center">
              <Image
                loader={myLoader}
                src={
                  "https://www.dropbox.com/s/oxlkcjkjn9tmxrh/profile%20image%20circle.png?raw=1"
                }
                width={250}
                height={250}
                layout="responsive"
                alt="my_picture_profile"
                className="p-3"
              />
            </div>
          </div>
          <div className="col-md-8 align-self-center">
            <div className="row">
              <h3>Thanachon Supasatian</h3>
              <p>
                A self-taught programmer and former mechanical engineer who
                strongly believes man can do anything as long as he/she has the
                willpower and passion to do it.
              </p>
              <p>
                Believing in your potential that you can do it and you also can
                become a better person help overcome difficult challenges that
                life might throw at you. Having good friends can also help it.
                Working as a team is a powerful tool that humans build our
                civilization for a thousand years.
              </p>
              <p>
                With a good mindset, great teamwork. Anything can be done, any
                problem can be solved. Nothing is going to hold you from your
                success.
              </p>
              <p>
                Learning how to code is by far the best decision of my life. It
                is marvelous and powerful. It opens the way I can put my
                creativity and technical skills to make things come true.
              </p>
            </div>
            <div className="row">
              <div className="col-lg-6">
                <ul id="personal-detail">
                  <li className="d-flex justify-content-between">
                    <strong>Gender:</strong>
                    <span>Male</span>
                  </li>
                  <li className="d-flex justify-content-between">
                    <strong>Nationality:</strong>
                    <span>Thai</span>
                  </li>
                  <li className="d-flex justify-content-between">
                    <strong>Date of Birth:</strong>
                    <span>18 December 1995</span>
                  </li>
                  <li className="d-flex justify-content-between">
                    <strong>City:</strong>
                    <span>Nonthaburi</span>
                  </li>
                </ul>
              </div>
              <div className="col-lg-6">
                <ul id="personal-detail">
                  <li className="d-flex justify-content-between">
                    <strong>Email:</strong>
                    <span>thanachonfirst@hotmail.com</span>
                  </li>
                  <li className="d-flex justify-content-between">
                    <strong>Github:</strong>
                    <a href="https://github.com/thasup" target="blank">
                      thasup
                    </a>
                  </li>
                  <li className="d-flex justify-content-between">
                    <strong>LinkedIn:</strong>
                    <a
                      href="https://www.linkedin.com/in/thanachon-supasatian-278292159/"
                      target="blank"
                    >
                      Thanachon Supasatian
                    </a>
                  </li>
                  <li className="d-flex justify-content-between">
                    <strong>Phone:</strong>
                    <span>085 406 0527</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutMe;
