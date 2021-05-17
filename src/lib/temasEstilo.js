import { Dimensions } from 'react-native';

const pantallaChica = Math.round(Dimensions.get('window')?.height) < 600;

const temaOscuro = {
  // Globales
  colorFondoGlobal: '#088CCA',
  colorFondoEncabezadoTitulos: '#0A72A4',
  colorFondoContenedorDatos: '#ffffff',
  colorTextoGeneral: '#686870',
  colorLetraEncabezado: '#fff',
  // Navegación
  colorBarraNavegacion: '#0A72A4',
  // Login
  colorFondoLogoLogin: '#0A72A4',

  colorTextoConfirmacionTurno: '#393e46',
  colorVersion: '#CCCCCC',
  mensajeError: {
    color: '#852E1D',
    fontSize: pantallaChica ? 15 : 17
  },
  tituloSeccion: {
    fontSize: pantallaChica ? 16.5 : 18.5,
    color: '#686870',
    lineHeight: 50
  },
  tituloSeccionClaro: {
    fontSize: pantallaChica ? 16.5 : 18.5,
    color: '#ffffff',
    lineHeight: 50
  },
  textoAviso: {
    fontSize: pantallaChica ? 15 : 17,
    color: '#fff',
    textAlign: 'center'
  },
  tituloGrande: {
    fontSize: pantallaChica ? 20 : 22,
    color: '#fff',
    fontWeight: 'bold'
  },
  subtituloGrande: {
    fontSize: pantallaChica ? 17 : 19,
    color: '#fff',
    textAlign: 'center',
    lineHeight: 25,
  },
  // Caja de texto
  tallaFuenteCajaTexto: 18,
  // Botones
  colorFondoBotonPrincipal: '#0A72A4',
  colorBordeBotonPrincipal: '#0A72A4',
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
  tamañoLogoCentroTeja: pantallaChica ? 60 : 70,
  // Avatar
  colorAvatarLetra: '#8B6CC6',
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
    fontSize: pantallaChica ? 20 : 22,
    color: '#393e46',
    fontWeight: 'bold'
  },
  subtituloGrande: {
    fontSize: pantallaChica ? 17 : 19,
    color: '#393e46',
    textAlign: 'center',
    lineHeight: 20,
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
  tamañoLogoCentroTejaChica: pantallaChica ? 100 : 110,
  tamañoLogoCentroTeja: pantallaChica ? 110 : 130,
  colorAvatarLetra: '#3da4ab',
  tamanoLetraEtiqueta: pantallaChica ? 17 : 19,
  colorIconos: '#000'
};

export default { temaOscuro, temaClaro };
