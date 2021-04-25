import { Dimensions } from 'react-native';

const pantallaChica = Math.round(Dimensions.get('window')?.height) < 600;

const temaOscuro = {
  // Navegación
  colorBarraNavegacion: '#00566D',
  // Login
  colorFondoPantallaLogin: '#026F8E',
  colorFondoLogoLogin: '#03637E',

  colorFondoGlobal: '#2A4D57',
  colorFondoEncabezadoTitulos: '#00566D',
  colorFondoContenedorDatos: '#005f79',
  colorTextoGeneral: '#2B2B2D',
  colorLetraEncabezado: '#fff',
  colorTextoConfirmacionTurno: '#393e46',
  colorVersion: '#CCCCCC',
  mensajeError: {
    color: '#852E1D',
    fontSize: pantallaChica ? 15 : 17
  },
  tituloSeccion: {
    fontSize: pantallaChica ? 16.5 : 18.5,
    color: '#FFF',
    lineHeight: 50
  },
  textoAviso: {
    fontSize: pantallaChica ? 17 : 19,
    color: '#fff',
    margin: 20,
    textAlign: 'center'
  },
  tituloGrande: {
    fontSize: pantallaChica ? 22 : 24,
    color: '#fff',
    fontWeight: 'bold'
  },
  subtituloGrande: {
    fontSize: pantallaChica ? 18 : 20,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center'
  },
  // Caja de texto
  tallaFuenteCajaTexto: 18,
  // Botones
  colorFondoBotonPrincipal: '#026F8E',
  colorBordeBotonPrincipal: '#026F8E',
  colorTextoBotonPrincipal: '#ffffff',
  colorEfectoClickBotonPrincipal: '#005f79',
  colorFondoBotonSecundario: '#E7E9EE',
  colorBordeBotonSecundario: '#E7E9EE',
  colorEfectoClickBotonSecundario: '#E7E9EE',
  tallaFuenteBoton: 18,
  // Centro atención
  imagenLogoCentro: {
    height: pantallaChica ? 130 : 150,
    width: pantallaChica ? 130 : 150
  },
  tamañoLogoCentroTeja: pantallaChica ? 90 : 100,
  anchoEtiquetaTeja: pantallaChica
    ? Math.round(Dimensions.get('window')?.width) - 100
    : Math.round(Dimensions.get('window')?.width) - 110,
  // Avatar
  colorAvatarLetra: '#16817a',
  tamanoLetraEtiqueta: pantallaChica ? 17 : 19,
  // Iconos general
  colorIconos: '#ffffff'
};

const temaClaro = {
  colorBarraNavegacion: '#d1cebd',
  colorFondoPantallaLogin: '#026F8E',
  colorFondoGlobal: '#f5a31a',
  colorFondoEncabezadoTitulos: '#dd7631',
  colorFondoContenedorDatos: '#d1cebd',
  colorTextoGeneral: '#393e46',
  colorLetraEncabezado: '#393e46',
  colorTextoConfirmacionTurno: '#393e46',
  colorVersion: '#393e46',
  mensajeError: {
    color: '#852E1D',
    fontSize: pantallaChica ? 15 : 17
  },
  tituloSeccion: {
    fontSize: pantallaChica ? 18.5 : 20.5,
    color: '#393e46',
    lineHeight: 50
  },
  textoAviso: {
    fontSize: pantallaChica ? 19 : 21,
    color: '#393e46',
    margin: 20,
    textAlign: 'center'
  },
  tituloGrande: {
    fontSize: pantallaChica ? 24 : 26,
    color: '#393e46',
    fontWeight: 'bold'
  },
  subtituloGrande: {
    fontSize: pantallaChica ? 20 : 22,
    color: '#393e46',
    fontWeight: 'bold',
    textAlign: 'center'
  },
  colorFondoBotonPrincipal: '#3da4ab',
  colorBordeBotonPrincipal: '#3da4ab',
  colorTextoBotonPrincipal: '#ffffff',
  colorEfectoClickBotonPrincipal: '#005f79',
  colorFondoBotonSecundario: '#005f79',
  colorBordeBotonSecundario: '#005f79',
  colorEfectoClickBotonSecundario: '#fff',
  imagenLogoCentro: {
    height: pantallaChica ? 130 : 150,
    width: pantallaChica ? 130 : 150
  },
  tamañoLogoCentroTeja: pantallaChica ? 90 : 100,
  anchoEtiquetaTeja: pantallaChica
    ? Math.round(Dimensions.get('window')?.width) - 100
    : Math.round(Dimensions.get('window')?.width) - 110,
  colorAvatarLetra: '#3da4ab',
  tamanoLetraEtiqueta: pantallaChica ? 17 : 19,
  colorIconos: '#000'
};

export default { temaOscuro, temaClaro };
