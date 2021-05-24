// @flow
import React, { useState, useContext } from 'react';
import { View, Text } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import BotonRedondeado from '../../componentes/comunes/botonRedondeado';
import { ContextoEstilosGlobales } from '../../lib/contextoEstilosGlobales';

LocaleConfig.locales.es = {
  monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
  monthNamesShort: ['Ene', 'Feb', 'Mar', 'Abr', 'Mayo', 'Jun', 'Jul', 'Ago', 'Sept', 'Oct', 'Nov', 'Dic'],
  dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
  dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mier', 'Jue', 'Vier', 'Sab'],
  today: 'Hoy'
};
LocaleConfig.defaultLocale = 'es';

const dias = [
  {
    day: '2021-05-23',
    available: true
  },
  {
    day: '2021-05-24',
    available: true
  },
  {
    day: '2021-05-25',
    available: true
  },
  {
    day: '2021-05-26',
    available: false
  },
  {
    day: '2021-05-27',
    available: true
  },
  {
    day: '2021-05-28',
    available: false
  },
  {
    day: '2021-05-29',
    available: true
  },
  {
    day: '2021-05-30',
    available: true
  },
  {
    day: '2021-05-31',
    available: true
  },
  {
    day: '2021-06-01',
    available: true
  }
];

const turnos = [
  {
    hour: '18:00:00',
    available: true
  },
  {
    hour: '18:15:00',
    available: true
  },
  {
    hour: '18:30:00',
    available: true
  },
  {
    hour: '18:45:00',
    available: true
  },
  {
    hour: '19:00:00',
    available: true
  },
  {
    hour: '19:15:00',
    available: true
  },
  {
    hour: '19:30:00',
    available: true
  },
  {
    hour: '19:45:00',
    available: true
  },
  {
    hour: '20:00:00',
    available: true
  },
  {
    hour: '20:15:00',
    available: true
  },
  {
    hour: '20:30:00',
    available: true
  },
  {
    hour: '20:45:00',
    available: true
  },
  {
    hour: '21:00:00',
    available: true
  }
];

function Calendario() {
  const { estilosGlobales } = useContext(ContextoEstilosGlobales);
  const [diaSeleccionado, fijarDiaSeleccionado] = useState();
  // Array a diccionario
  const diasDeshabilitados = Object.assign(
    {}, ...dias.filter(dia => !dia.available).map(
      (dia) => ({ [dia.day]: { disabled: true } })
    )
  );

  return !diaSeleccionado
    ? (
      <Calendar
              // Initially visible month. Default = Date()
        // current="2021-05-23"
        // Minimum date that can be selected, dates before minDate will be
        // grayed out. Default = undefined
        minDate="2020-12-31"
              // Maximum date that can be selected, dates after maxDate will
              // be grayed out. Default = undefined
        maxDate="2021-12-31"
              // Handler which gets executed on day press. Default = undefined
        onDayPress={day => fijarDiaSeleccionado(day.dateString) }
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
        // disableMonthChange
        // If firstDay=1 week starts from Monday. Note that dayNames and dayNamesShort
        // should still start from Sunday.
        firstDay={1}
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

        disabledDaysIndexes={[0, 1, 2]}

        markedDates={{
          ...diasDeshabilitados,
          [diaSeleccionado]: { selected: true, selectedColor: estilosGlobales.colorFondoLogoLogin },
        }}

        enableSwipeMonths
        selectedColor
        style={{
          height: 400
        }}
        theme={{
          'stylesheet.day.basic': {
            base: {
              width: 46,
              height: 46,
              alignItems: 'center',
              justifyContent: 'center',
            },
            selected: {
              // backgroundColor: 'estilosGlobales.colorFondoGlobal',
              borderRadius: 23,
            },
          },
          backgroundColor: '#ffffff',
          calendarBackground: '#ffffff',
          textSectionTitleColor: '#b6c1cd',
          textSectionTitleDisabledColor: '#d9e1e8',
          selectedDayBackgroundColor: estilosGlobales.colorFondoLogoLogin,
          selectedDayTextColor: '#ffffff',
          todayTextColor: estilosGlobales.colorFondoGlobal,
          dayTextColor: '#428E52',
          textDisabledColor: '#d9e1e8',
          arrowColor: estilosGlobales.colorFondoGlobal,
          disabledArrowColor: '#d9e1e8',
          monthTextColor: estilosGlobales.colorFondoGlobal,
          indicatorColor: estilosGlobales.colorFondoLogoLogin,
          // textDayFontFamily: 'monospace',
          // textMonthFontFamily: 'monospace',
          // textDayHeaderFontFamily: 'monospace',
          textDayFontWeight: '300',
          textMonthFontWeight: 'bold',
          textDayHeaderFontWeight: '300',
          textDayFontSize: 20,
          textMonthFontSize: 19,
          textDayHeaderFontSize: 18
        }}
      />
    ) : (
      <View>
        <BotonRedondeado
          manejadorClick={() => fijarDiaSeleccionado()}
          colorBorde={estilosGlobales.colorEfectoClickBotonSecundario}
          colorFondo={estilosGlobales.colorFondoBotonSecundario}
          colorEfecto={estilosGlobales.colorEfectoClickBotonSecundario}
          colorTexto={estilosGlobales.colorFondoBotonPrincipal}
          cargando={!diaSeleccionado}
        >
          Volver
        </BotonRedondeado>

        {turnos.filter(turno => turno.available).map(turno => (
          <Text key={turno.hour} style={{ color: '#000000' }}>{turno.hour}</Text>
        ))}
      </View>
    );
}

export default Calendario;
