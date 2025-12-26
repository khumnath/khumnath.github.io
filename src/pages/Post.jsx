import React from "react";
import ReactMarkdown from "react-markdown";
import Layout from "../components/Layout";

// For demo: import a markdown file directly
import post1 from "../posts/2023-10-31-post1.md";

const markdown = `# First Post\n\nThis is the content of the first post, originally from Jekyll.`;

const Post = () => (
  <Layout>
    <ReactMarkdown>{markdown}</ReactMarkdown>
  </Layout>
);

export default Post;
