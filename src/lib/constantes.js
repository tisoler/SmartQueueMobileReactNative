// @flow

export const apiURI = 'https://aillus.com.ar:8443/mobile-app/';

export const IconosCentros = {
  'afip_icon.png': require('../../recursos/imagenes/centros/afip_icon.png'),
  'bn_icon.png': require('../../recursos/imagenes/centros/bn_icon.png'),
  'ca_icon.png': require('../../recursos/imagenes/centros/ca_icon.png'),
  'cmpaz_icon.png': require('../../recursos/imagenes/centros/cmpaz_icon.png'),
  'municdc.png': require('../../recursos/imagenes/centros/municdc.png'),
  'municdn.png': require('../../recursos/imagenes/centros/municdn.png'),
  'municds.png': require('../../recursos/imagenes/centros/municds.png'),
  'test_icon.png': require('../../recursos/imagenes/centros/test_icon.png')
};

export const NombresIconosGenerales = {
  correo: 'correo',
  contrasena: 'contrasena',
  usuario: 'usuario',
  dni: 'dni',
  camara: 'camara',
  girarCamara: 'girarCamara',
  menu: 'menu',
  cerrarSesion: 'cerrarSesion',
  aceptar: 'aceptar',
  cancelar: 'cancelar',
  cruz: 'cruz',
  turnos: 'turnos',
  paleta: 'paleta',
  refrescar: 'refrescar',
  ojo: 'ojo',
  logoLogin: 'logoLogin',
  lupa: 'lupa'
};

export const mensajes = {
  sinConexion: 'Parece que su dispositivo no tiene conexión a internet.',
  sinServicio: 'Disculpe, el servicio no está habilitado. Intente luego.'
};

export const tipoTurno = {
  fila: 1,
  agendado: 2,
};

export const pantalla = {
  centroAtencionFila: 0,
  centroAtencionTurno: 1,
  tipoTurno: 2,
  calendarioTurno: 3,
};
