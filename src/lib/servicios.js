// @flow
import { apiURI } from './constantes';

export const login = (payload: Object) => {
  const url = `${apiURI}login`;
  return fetch(url, {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    }
  });
};

export const actualizarTokenFb = (token: string, fbtoken: string) => {
  const url = `${apiURI}update-fbtoken`;
  return fetch(url, {
    method: 'POST',
    body: JSON.stringify({ fbtoken }),
    headers: {
      'x-access-token': token
    }
  });
};

export const obtenerTurnosTicketsParaUsuario = (token: string) => {
  const url = `${apiURI}get-turns-and-tickets/`;
  return fetch(url,
    {
      headers: {
        'x-access-token': token
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

export const obtenerTurnosParaUsuario = (token: string) => {
  const url = `${apiURI}get-all-my-turns/`;
  return fetch(url,
    {
      headers: {
        'x-access-token': token
      }
    });
};

export const obtenerDiasDisponibles = (token: string, idCentro: number) => {
  const url = `${apiURI}get-days-available/${idCentro}`;
  return fetch(url,
    {
      headers: {
        'x-access-token': token
      }
    });
};

export const obtenerTurnosDisponibles = (token: string, idCentro: number, fecha: string) => {
  const url = `${apiURI}get-turns-available/${idCentro}/${fecha}`;
  return fetch(url,
    {
      headers: {
        'x-access-token': token
      }
    });
};

export const obtenerTicket = (token: string, idCentro: number) => {
  const url = `${apiURI}/get-ticket/${idCentro}`;
  return fetch(url,
    {
      headers: {
        'x-access-token': token
      }
    });
};

export const obtenerTurno = (token: string, idCentro: number) => {
  const url = `${apiURI}/get-turn/${idCentro}`;
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

/*
  payload:
    "date": "2021-05-25",
    "time": "12:30:00",
    "CategoryId": 1,
    "CenterId": 1,
*/
export const generarTurno = (token: string, payload: Object) => {
  const url = `${apiURI}create-turno`;
  return fetch(url,
    {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
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

export const cancelarTurno = (token: string, idCentro: number) => {
  const url = `${apiURI}cancel-turn/${idCentro}`;
  return fetch(url,
    {
      headers: {
        'x-access-token': token
      }
    });
};

export const confirmarAsistenciaTicket = (token: string, idCentro: number) => {
  const url = `${apiURI}set-ready/${idCentro}`;
  return fetch(url,
    {
      headers: {
        'x-access-token': token
      }
    });
};

export const confirmarAsistenciaTurno = (token: string, idCentro: number) => {
  const url = `${apiURI}set-ready-turn/${idCentro}`;
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

export const validarExistenciaEmanil: Function = (email: string) => fetch(`${apiURI}client-email-exists/${email}`);

export const validarExistenciaDNI: Function = (dni: string) => fetch(`${apiURI}client-dni-exists/${dni}`);

export const guardarAvatar: Function = (payload: Object) => {
  const url = `${apiURI}client-avatar`;
  return fetch(url, {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    }
  });
};

export const guardarUsuario = (payload: Object) => {
  const url = `${apiURI}client`;
  return fetch(url, {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    }
  });
};
