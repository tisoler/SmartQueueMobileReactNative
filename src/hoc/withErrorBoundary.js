// @flow
/* eslint-disable react/jsx-props-no-spreading */
import * as React from 'react';
import ErrorBoundary from './errorBoundary';

const withErrorBoundary = (
  errorMessage: string,
  Component: React.ComponentType<any>
) => (props: Object) => (
  <ErrorBoundary errorMessage={errorMessage}>
    <Component {...props} />
  </ErrorBoundary>
);

export default withErrorBoundary;
