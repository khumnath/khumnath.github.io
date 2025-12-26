import React from "react";

const Header = () => {
  // TODO: Replace all Jekyll/Liquid variables with React props/context
  // and move logic to React as needed.
  return (
    <>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      {/* TODO: Set dynamic title and meta tags using React Helmet or similar */}
      <title>Site Title - Page Title</title>
      {/* TODO: Add Google Fonts, Analytics, and favicon links as needed */}
      <link rel="shortcut icon" href="/assets/img/favicons/favicon.ico" />
      <link rel="icon" type="image/png" sizes="32x32" href="/assets/img/favicons/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/assets/img/favicons/favicon-16x16.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/assets/img/favicons/apple-touch-icon.png" />
      {/* TODO: Add robots and schema meta tags as needed */}
    </>
  );
};

export default Header;
