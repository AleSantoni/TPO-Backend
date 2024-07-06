//const BASEURL = 'http://127.0.0.1:5000'; // establezco la url

const BASEURL = 'https://alejandrosantoni.pythonanywhere.com/';

/**
 * Función para realizar una petición fetch con JSON.
 * @param {string} url - La URL a la que se realizará la petición.
 * @param {string} method - El método HTTP a usar (GET, POST, PUT, DELETE, etc.).
 * @param {Object} [data=null] - Los datos a enviar en el cuerpo de la petición.
 * @returns {Promise<Object>} - Una promesa que resuelve con la respuesta en formato JSON.
 */
async function fetchData(url, method, data = null) {
  const options = {
    method: method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: data ? JSON.stringify(data) : null,
  };
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Fetch error:', error);
    alert('An error occurred while fetching data. Please try again.');
  }
}

/**
 * Función para comunicarse con el servidor para poder Crear o Actualizar un registro de usuario.
 */
async function saveRegistro() {
  const idRegistro = document.querySelector('#id-registro').value;
  const Name = document.querySelector('#name').value;
  const Email = document.querySelector('#email').value;
  const Password = document.querySelector('#password').value;
  const Rol = document.querySelector('#rol').value;

  // VALIDACION DE FORMULARIO
  if (!Name || !Email || !Password || !Rol) {
    Swal.fire({
      title: 'Error!',
      text: 'Por favor completa todos los campos.',
      icon: 'error',
      confirmButtonText: 'Cerrar',
      background: '#f9f9f9',
      customClass: {
        popup: 'swal-popup-class',
        title: 'swal-title-class',
        content: 'swal-content-class',
        confirmButton: 'swal-confirm-button-class'
      }
    });
    return;
  }

  // Crea un objeto con los datos del registro
  const registroData = {
    Name: Name,
    Email: Email,
    Password: Password,
    rol: Rol,
  };

  let result = null;
  if (idRegistro !== "") {
    result = await fetchData(`${BASEURL}/api/registros/${idRegistro}`, 'PUT', registroData);
  } else {
    result = await fetchData(`${BASEURL}/api/registros/`, 'POST', registroData);
  }

  const formRegistro = document.querySelector('#form-registro');
  formRegistro.reset();
  Swal.fire({
    title: '¡Éxito!',
    text: result.message,
    icon: 'success',
    confirmButtonText: 'Cerrar',
    background: '#f9f9f9',
    customClass: {
      popup: 'swal-popup-class',
      title: 'swal-title-class',
      content: 'swal-content-class',
      confirmButton: 'swal-confirm-button-class',
      cancelButton: 'swal-cancel-button-class'
    }
  });
  showRegistros();
}

/**
 * Funcion que permite crear un elemento <tr> para la tabla de registros por medio del uso de template string de JS.
 */
async function showRegistros() {
  let registros = await fetchData(BASEURL + '/api/registros/', 'GET');
  const tableRegistros = document.querySelector('#list-table-registros tbody');
  tableRegistros.innerHTML = '';
  registros.forEach((registro) => {
    let tr = `<tr>
                <td>${registro.Name}</td>
                <td>${registro.Email}</td>
                <td>${registro.Password}</td>
                <td>${registro.rol}</td>
                <td>
                  <button class="btn-edit" onclick='updateRegistro(${registro.idRegistro})'>Editar</button>
                  <button class="btn-delete" onclick='deleteRegistro(${registro.idRegistro})'>Eliminar</button>
                </td>
              </tr>`;
    tableRegistros.insertAdjacentHTML("beforeend", tr);
  });
}

/**
 * Function que permite eliminar un registro del array del localstorage de acuerdo al indice del mismo
 * @param {number} id posición del array que se va a eliminar
 */
function deleteRegistro(id) {
  Swal.fire({
    title: "¿Está seguro de eliminar el registro?",
    showCancelButton: true,
    confirmButtonText: "Eliminar",
    customClass: {
      popup: 'swal-popup-class',
      title: 'swal-title-class',
      content: 'swal-content-class',
      confirmButton: 'swal-confirm-button-class',
      cancelButton: 'swal-cancel-button-class'
    }
    
  }).then(async (result) => {
    if (result.isConfirmed) {
      let response = await fetchData(`${BASEURL}/api/registros/${id}`, 'DELETE');
      showRegistros();
      Swal.fire(response.message, "", "success");
    }
  });
}

/**
 * Function que permite cargar el formulario con los datos del registro para su edición
 * @param {number} id Id del registro que se quiere editar
 */
async function updateRegistro(id) {
  let response = await fetchData(`${BASEURL}/api/registros/${id}`, 'GET');
  const idRegistro = document.querySelector('#id-registro');
  const Name = document.querySelector('#name');
  const Email = document.querySelector('#email');
  const Password = document.querySelector('#password');
  const Rol = document.querySelector('#rol');

  idRegistro.value = response.idRegistro;
  Name.value = response.Name;
  Email.value = response.Email;
  Password.value = response.Password;
  Rol.value = response.rol;
}

document.addEventListener('DOMContentLoaded', function () {
  const btnSaveRegistro = document.querySelector('#btn-save-registro');
  btnSaveRegistro.addEventListener('click', saveRegistro);
  showRegistros();
});
