/**
 * Implement Gatsby's SSR (Server Side Rendering) APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/ssr-apis/
 */

import React from 'react';

export const onRenderBody = ({ setHeadComponents }) => {
  setHeadComponents([
    <meta
      key="google-site-verification"
      name="google-site-verification"
      content="9KaR88072bjKmb71cAkDO2f31IZCTblcQDX200Cv9EI"
    />,
  ]);
};

// You can delete this file if you're not using it