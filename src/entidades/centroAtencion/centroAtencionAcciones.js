// @flow

export const fijarCentrosAccion = (
  asignarEstadoLogin: Function,
  listaCentros: Array<Object>
) => {
  const centros = listaCentros.sort((a, b) => {
    if (a.name.toLowerCase() >= b.name.toLowerCase()) return 1;
    return -1;
  });
  // centros contiene solo los filtrados, todosLosCentros contiene a todos.
  asignarEstadoLogin({ centros, todosLosCentros: centros });
};

export const filtrarCentrosAccion = (
  estadoCentros: Object,
  asignarEstadoLogin: Function,
  textoBusqueda: string
) => {
  const centros = textoBusqueda?.trim().length > 0
    ? estadoCentros.todosLosCentros.filter(
      centro => centro.name.toLowerCase().includes(textoBusqueda.toLowerCase())
    )
    : estadoCentros.todosLosCentros;
  // centros contiene solo los filtrados, todosLosCentros contiene a todos.
  asignarEstadoLogin({ ...estadoCentros, ...{ centros } });
};
