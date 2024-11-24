/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/reference/config-files/gatsby-browser/
 */

import React from 'react';
import  AuthProvider  from './src/context/AuthContext';

export const wrapRootElement = ({ element }) => (
  <AuthProvider>{element}</AuthProvider>
);