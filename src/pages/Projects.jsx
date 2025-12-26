
import React from "react";
import Layout from "../components/Layout";
import { useConfig } from "../utils/ConfigContext";
import GithubRepos from "../components/GithubRepos";

const Projects = () => {
  const { currentLang, lang } = useConfig();

  const headingTitle = lang.projects.heading || "projects i am working on";

  return (
    <Layout>
      <div className="multipurpose-container project-heading-container" style={{
        backgroundColor: "lightblue",
        color: "white",
        textAlign: "center",
        padding: "50px 0",
        marginBottom: "20px"
      }}>
        <h1>{lang.projects.title}</h1>
      </div>

      <div className="multipurpose-container post-container">
        <p style={{ textAlign: "center", fontWeight: "bold" }}>
          {headingTitle}
        </p>

        <GithubRepos username="khumnath" />

      </div>
    </Layout>
  );
};


export default Projects;
