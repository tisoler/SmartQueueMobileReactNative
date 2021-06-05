// @flow
import React, {
  useState, useContext, useRef, useEffect
} from 'react';
import { View, Alert, ActivityIndicator } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import BotonRedondeado from '../../componentes/comunes/botonRedondeado';
import { ContextoEstilosGlobales } from '../../lib/contextoEstilosGlobales';
import { ContextoIdiomas } from '../../lib/contextoIdioma';
import TurnosDisponibles from './turnosDisponibles';
import { obtenerDiasDisponibles } from '../../lib/servicios';
import { ContextoEstados } from '../../lib/contextoEstados';
import { procesarMensajeError, esTokenValido, } from '../../lib/ayudante';

LocaleConfig.locales.es = {
  monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
  monthNamesShort: ['Ene', 'Feb', 'Mar', 'Abr', 'Mayo', 'Jun', 'Jul', 'Ago', 'Sept', 'Oct', 'Nov', 'Dic'],
  dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
  dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mier', 'Jue', 'Vier', 'Sab'],
  today: 'Hoy'
};

LocaleConfig.locales.en = {
  monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'],
  dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  dayNamesShort: ['Sun', 'Mon', 'Tue', 'Web', 'Thu', 'Fri', 'Sat'],
  today: 'Today'
};

function Calendario(props: any) {
  const {
    centro, elegirTipoTurno, categoria, navigation,
  } = props;
  const {
    estadoLogin,
    estadoFbToken,
    estadoTemaUsuario,
    estadoIdiomaUsuario,
    fijarUsuarioLogueadoEnEstado,
  } = useContext(ContextoEstados);
  const { estilosGlobales } = useContext(ContextoEstilosGlobales);
  const { textosGlobales } = useContext(ContextoIdiomas);
  const [diaSeleccionado, fijarDiaSeleccionado] = useState();
  const diasDeshabilitados = useRef();
  const fechaDesde = useRef();
  const fechaHasta = useRef();
  const [cargando, fijarCargando] = useState(true);

  LocaleConfig.defaultLocale = textosGlobales.calendarioCultura;

  useEffect(() => {
    const fijarDiasDisponibles = (dias) => {
      // Arreglo a diccionario
      diasDeshabilitados.current = Object.assign(
        {}, ...dias.filter(dia => !dia.available).map(
          (dia) => ({ [dia.day]: { disabled: true } })
        )
      );

      const [primerDia] = dias;
      fechaDesde.current = primerDia.day;
      fechaHasta.current = dias[dias.length - 1].day;
    };

    const consultarDiasDisponibles = () => obtenerDiasDisponibles(estadoLogin.token, centro?.id)
      .then(res => res.json())
      .then(respuesta => {
        if (respuesta.success) {
          fijarDiasDisponibles(respuesta.response);
          fijarCargando(false);
        } else {
          fijarCargando(false);
          Alert.alert('Error al obtener días disponibles.');
        }
      })
      .catch((error) => {
        if (esTokenValido(
          error?.message,
          fijarUsuarioLogueadoEnEstado,
          estadoLogin.email,
          estadoFbToken,
          estadoTemaUsuario,
          estadoIdiomaUsuario,
        )) {
          fijarCargando(false);
          Alert.alert(procesarMensajeError(error.message, 'Error durante la carga de días disponibles.'));
        }
      });

    consultarDiasDisponibles();
  }, [categoria]);

  const fechaHoy = new Date();

  if (cargando) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color={estilosGlobales.colorFondoLogoLogin} />
      </View>
    );
  }

  return !diaSeleccionado
    ? (
      <View style={{
        flex: 1, width: '100%', direction: 'column', justifyContent: 'flex-start'
      }}
      >
        <Calendar
                // Initially visible month. Default = Date()
          // current="2021-05-23"
          // Minimum date that can be selected, dates before minDate will be
          // grayed out. Default = undefined
          minDate={fechaDesde.current || `${fechaHoy.getFullYear()}-${fechaHoy.getMonth()}-${fechaHoy.getDay()}`}
                // Maximum date that can be selected, dates after maxDate will
                // be grayed out. Default = undefined
          maxDate={fechaHasta.current || `${fechaHoy.getFullYear()}-12-31`}
                // Handler which gets executed on day press. Default = undefined
          onDayPress={day => fijarDiaSeleccionado(day.dateString)}
                // Handler which gets executed on day long press. Default = undefined
          // onDayLongPress={(day) => { console.log('selected day', day); }}
                // Month format in calendar title. Formatting values: http://arshaw.com/xdate/#Formatting
          monthFormat="MMMM yyyy"
          // Handler which gets executed when visible month changes in calendar. Default = undefined
          // onMonthChange={(month) => { console.log('month changed', month); }}
                // Hide month navigation arrows. Default = false
          // hideArrows
                // Replace default arrows with custom ones (direction can be 'left' or 'right')
          // renderArrow={() => (<Arrow />)}
                // Do not show days of other months in month page. Default = false
          // hideExtraDays
          // If hideArrows=false and hideExtraDays=false do not switch month when
          // tapping on greyed out
          // day from another month that is visible in calendar page. Default = false
          disableMonthChange={false}
          // If firstDay=1 week starts from Monday. Note that dayNames and dayNamesShort
          // should still start from Sunday.
          firstDay={0}
                // Hide day names. Default = false
          // hideDayNames
                // Show week numbers to the left. Default = false
          // showWeekNumbers
          // Handler which gets executed when press arrow icon left. It receive
          // a callback can go back month
          onPressArrowLeft={subtractMonth => subtractMonth()}
          // Handler which gets executed when press arrow icon right. It
          // receive a callback can go next month
          onPressArrowRight={addMonth => addMonth()}
          // Disable left arrow. Default = false
          // disableArrowLeft
          // Disable right arrow. Default = false
          // disableArrowRight
          // Disable all touch events for disabled days. can be override with
          // disableTouchEvent in markedDates
          disableAllTouchEventsForDisabledDays
          // Replace default month and year title with custom one. the function receive
          // a date as parameter.
          // renderHeader={() => { /* Return JSX */ }}
          // Enable the option to swipe between months. Default = false
          enableSwipeMonths

          markedDates={{
            ...diasDeshabilitados,
            [diaSeleccionado || '']: {
              selected: true,
              selectedColor: estilosGlobales.colorFondoLogoLogin
            },
          }}

          style={{
            height: 280,
            width: '100%',
            padding: 0,
            marginEnd: 0,
          }}
          theme={{
            'stylesheet.day.basic': {
              base: {
                width: 38,
                height: 38,
                alignItems: 'center',
                justifyContent: 'center',
              },
              selected: {
                // backgroundColor: 'estilosGlobales.colorFondoGlobal',
                borderRadius: 19,
              },
            },
            backgroundColor: '#ffffff',
            calendarBackground: '#ffffff',
            textSectionTitleColor: '#b6c1cd',
            textSectionTitleDisabledColor: '#d9e1e8',
            selectedDayBackgroundColor: estilosGlobales.colorFondoLogoLogin,
            selectedDayTextColor: '#ffffff',
            todayTextColor: estilosGlobales.colorFondoGlobal,
            dayTextColor: '#818792',
            textDisabledColor: '#d9e1e8',
            arrowColor: estilosGlobales.colorFondoGlobal,
            disabledArrowColor: '#d9e1e8',
            monthTextColor: estilosGlobales.colorFondoGlobal,
            indicatorColor: estilosGlobales.colorFondoLogoLogin,
            // textDayFontFamily: 'monospace',
            // textMonthFontFamily: 'monospace',
            // textDayHeaderFontFamily: 'monospace',
            textDayFontWeight: '600',
            textMonthFontWeight: 'bold',
            textDayHeaderFontWeight: '300',
            textDayFontSize: 19,
            textMonthFontSize: 19,
            textDayHeaderFontSize: 17
          }}
        />
        <View style={{
          alignItems: 'center', flex: 1, justifyContent: 'flex-end', paddingBottom: 10
        }}
        >
          <BotonRedondeado
            key="cancelar"
            manejadorClick={() => elegirTipoTurno()}
            colorBorde={estilosGlobales.colorEfectoClickBotonSecundario}
            colorFondo="#ffffff"
            colorEfecto={estilosGlobales.colorEfectoClickBotonSecundario}
            colorTexto={estilosGlobales.colorFondoBotonPrincipal}
            flechaAlPrincipio
          >
            {textosGlobales.calendarioCancelar}
          </BotonRedondeado>
        </View>
      </View>
    ) : (
      <TurnosDisponibles
        centro={centro}
        categoria={categoria}
        fijarDiaSeleccionado={fijarDiaSeleccionado}
        diaSeleccionado={diaSeleccionado}
        elegirTipoTurno={elegirTipoTurno}
        navigation={navigation}
      />
    );
}

export default Calendario;
