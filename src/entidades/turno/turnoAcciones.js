// @flow

const fijarTurnoActualAccion = (
  asignarEstadoTurnoActual: Function,
  turno: Object,
  demora: Object,
  irHaciaTurno: boolean
) => {
  asignarEstadoTurnoActual({ turno, demora, irHaciaTurno });
};

export default fijarTurnoActualAccion;
