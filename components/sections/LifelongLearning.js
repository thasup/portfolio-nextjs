import React, { useState } from "react";
import { Tabs, Tab, Container } from "react-bootstrap";
import iframesData from "@/data/iframes.json";

const iframes = iframesData.data.iframes;

const LifelongLearning = () => {
  const [key, setKey] = useState(iframes[0].name);

  return (
    <section id="lifelong-learning" className="section-container section-bg">
      <Container>
        <h2 className="text-start mb-4">Lifelong Learning</h2>

        <div>
          <Tabs
            id="lifelong-learning-tabs"
            activeKey={key}
            onSelect={(k) => setKey(k)}
            className="mb-3 justify-content-center"
            justify
          >
            {iframes.map((iframe) => (
              <Tab key={iframe.name} eventKey={iframe.name} title={iframe.name}>
                <div
                  className="iframe-container"
                  dangerouslySetInnerHTML={{ __html: iframe.iframeContent }}
                />
              </Tab>
            ))}
          </Tabs>
        </div>
      </Container>
    </section>
  );
};

export default LifelongLearning;
