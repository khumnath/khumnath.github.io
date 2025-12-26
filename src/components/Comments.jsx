import React from "react";

// Example: Giscus (GitHub Discussions) embed. Replace with Disqus or other if needed.
const Comments = () => {
  return (
    <div className="comments">
      {/* Giscus widget embed example */}
      <script src="https://giscus.app/client.js"
        data-repo="khumnath/khumnath.github.io"
        data-repo-id="YOUR_REPO_ID"
        data-category="General"
        data-category-id="YOUR_CATEGORY_ID"
        data-mapping="pathname"
        data-strict="0"
        data-reactions-enabled="1"
        data-emit-metadata="0"
        data-input-position="bottom"
        data-theme="light"
        data-lang="en"
        crossOrigin="anonymous"
        async />
      <noscript>Please enable JavaScript to view the comments.</noscript>
    </div>
  );
};

export default Comments;
