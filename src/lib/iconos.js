// @flow
import * as React from 'react';
import { NombresIconosGenerales } from './constantes';
import Correo from '../componentes/comunes/svg/correo';
import Contrasena from '../componentes/comunes/svg/contrasena';
import Menu from '../componentes/comunes/svg/menu';
import Usuario from '../componentes/comunes/svg/usuario';
import DNI from '../componentes/comunes/svg/dni';
import Camara from '../componentes/comunes/svg/camara';
import GirarCamara from '../componentes/comunes/svg/girarCamara';
import CerrarSesion from '../componentes/comunes/svg/cerrarSesion';
import Aceptar from '../componentes/comunes/svg/aceptar';
import Cancelar from '../componentes/comunes/svg/cancelar';
import Turnos from '../componentes/comunes/svg/turnos';
import Paleta from '../componentes/comunes/svg/paleta';

const IconosGenerales = {
  [NombresIconosGenerales.correo]: <Correo width={29} height={29} />,
  [NombresIconosGenerales.contrasena]: <Contrasena width={30} height={30} />,
  [NombresIconosGenerales.usuario]: <Usuario width={34} height={34} />,
  [NombresIconosGenerales.dni]: <DNI width={32} height={32} />,
  [NombresIconosGenerales.camara]: <Camara width={55} height={55} />,
  [NombresIconosGenerales.girarCamara]: <GirarCamara width={50} height={50} />,
  [NombresIconosGenerales.menu]: <Menu width={35} height={35} />,
  [NombresIconosGenerales.cerrarSesion]: <CerrarSesion width={30} height={30} />,
  [NombresIconosGenerales.aceptar]: <Aceptar width={57} height={57} />,
  [NombresIconosGenerales.cancelar]: <Cancelar width={55} height={55} />,
  [NombresIconosGenerales.turnos]: <Turnos width={35} height={35} />,
  [NombresIconosGenerales.paleta]: <Paleta width={30} height={30} />,
};

export default IconosGenerales;
