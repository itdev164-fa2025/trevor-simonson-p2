import React from 'react';
import  AuthProvider  from './src/context/AuthContext';

export const wrapRootElement = ({ element }) => (
  <AuthProvider>{element}</AuthProvider>
);

/**
 * @type {import('gatsby').GatsbySSR['onRenderBody']}
 */
// exports.onRenderBody = ({ setHtmlAttributes }) => {
//   setHtmlAttributes({ lang: `en` })
// }

