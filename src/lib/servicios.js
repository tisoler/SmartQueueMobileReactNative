// @flow
import { apiURI } from './constantes';

export const login = (payload: Object) => {
  const url = `${apiURI}login/`;
  return fetch(url, {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

export const obtenerTicketsParaUsuario = (token: string) => {
  const url = `${apiURI}get-all-my-tickets/`;
  return fetch(url,
    {
      headers: {
        'x-access-token': token
      }
    });
};

export const obtenerCentrosAtencion = (token: string) => {
  const url = `${apiURI}centers/`;
  return fetch(url,
    {
      headers: {
        'x-access-token': token
      }
    });
};

export const estimarDemora = (token: string, idCategoria: number, idCentro: number) => {
  const url = `${apiURI}estimate/${idCategoria}/${idCentro}`;
  return fetch(url,
    {
      headers: {
        'x-access-token': token
      }
    });
};

export const generarTicket = (token: string, idCategoria: number, idCentro: number) => {
  const url = `${apiURI}generate/${idCategoria}/${idCentro}`;
  return fetch(url,
    {
      headers: {
        'x-access-token': token
      }
    });
};

export const cancelarTicket = (token: string, idCentro: number) => {
  const url = `${apiURI}cancel/${idCentro}`;
  return fetch(url,
    {
      headers: {
        'x-access-token': token
      }
    });
};

export const confirmarAsistencia = (token: string, idCentro: number) => {
  const url = `${apiURI}set-ready/${idCentro}`;
  return fetch(url,
    {
      headers: {
        'x-access-token': token
      }
    });
};

export const evaluarTurno = (token: string, idCentro: number, calificacion: number) => {
  const url = `${apiURI}/feed/${idCentro}/${calificacion}`;
  return fetch(url,
    {
      headers: {
        'x-access-token': token
      }
    });
};
