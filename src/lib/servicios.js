import { apiURI } from './constantes';

export const login = (payload) => {
	const url = `${apiURI}login/`;
	return fetch(url, {
			method: "POST",
			body: JSON.stringify(payload),
			headers: {
					"Content-Type": "application/json"
			}
	});
}

export const obtenerCentrosAtencion = (token) => {
	const url = `${apiURI}centers/`;
	return fetch(url, 
		{
			headers:{
				'x-access-token': token
			}
		}
  );
}

export const obtenerCategoriasDeCentro = (token, idCentro) => {
	const url = `${apiURI}categories/${idCentro}`;
	return fetch(url, 
		{
			headers:{
				'x-access-token': token
			}
		}
  );
}

export const estimarDemora = (token, idCategoria, idCentro) => {
	const url = `${apiURI}estimate/${idCategoria}/${idCentro}`;
	return fetch(url, 
		{
			headers:{
				'x-access-token': token
			}
		}
  );
}

export const generarTicket = (token, idCategoria, idCentro) => {
	const url = `${apiURI}generate/${idCategoria}/${idCentro}`;
	return fetch(url, 
		{
			headers:{
				'x-access-token': token
			}
		}
  );
}

export const cancelarTicket = (token, idTurno) => {
	const url = `${apiURI}cancel/${idTurno}`;
	return fetch(url, 
		{
			headers:{
				'x-access-token': token
			}
		}
  );
}

export const confirmarAsistencia = (token, idCentro) => {
	const url = `${apiURI}set-ready/${idCentro}`;
	return fetch(url, 
		{
			headers:{
				'x-access-token': token
			}
		}
  );
}
