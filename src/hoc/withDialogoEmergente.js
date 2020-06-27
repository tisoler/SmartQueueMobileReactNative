// @flow
/* eslint-disable react/jsx-props-no-spreading */
import * as React from 'react';
import DialogoEmergente from './dialogoEmergente';

const withDialogoEmergente = (Component: React.ComponentType<any>) => (props: Object) => {
  return (
    <>
      <DialogoEmergente />
      <Component {...props} />
    </>
  );
};

export default withDialogoEmergente;
