import React from 'react';
import ErrorBoundary from './errorBoundary';

const withErrorBoundary = (errorMessage, Component) => (props) => (
  <ErrorBoundary errorMessage={errorMessage}>
    <Component {...props} />
  </ErrorBoundary>
);

export default withErrorBoundary;