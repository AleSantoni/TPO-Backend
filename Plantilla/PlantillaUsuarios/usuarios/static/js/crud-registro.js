class Registro {
    constructor(id, name, email, password, rol) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.rol = rol;
    }
}

// function showMovies ahora es function showRegistros
function showRegistros() {
    //BUSCAR LO QUE HAY EN LOCAL STORAGE
    let registros = JSON.parse(localStorage.getItem('registros')) || [];

    //buscar elemento HTML donde quiero insertar los registros
    const tbodyRegistros = document.querySelector('#list-table-registros tbody');
    //limpio el contenido de la tabla
    tbodyRegistros.innerHTML = '';
    registros.forEach(registro => {
        //TEMPLATE STRING - TEMPLATE LITERAL 
        const tr = `
                    <tr>
                        <td>${registro.name}</td>
                        <td>${registro.email}</td>
                        <td>${registro.password}</td>
                        <td>${registro.rol}</td>
                        <td>
                            <button class="btn-cac" onclick='updateRegistro(${registro.id})'><i class="fa fa-pencil" ></button></i>
                            <button class="btn-cac" onclick='deleteRegistro(${registro.id})'><i class="fa fa-trash" ></button></i>
                        </td>
                    </tr>
        `;
        tbodyRegistros.insertAdjacentHTML('beforeend',tr);
    });

}

/**
 * funcion que permite agregar o modificar un registro al listado de registros
 * almacenado en el localstorage
 */
function saveRegistro(){
    //Obtengo el elemento HTML del formulario
    const form = document.querySelector('#form-registro');

    //obtengo los inputs del formulario
    const inputId = document.querySelector('#id-registro');
    const inputName = document.querySelector('#name');
    const inputEmail = document.querySelector('#email');
    const inputPassword = document.querySelector('#password');
    const inputRol = document.querySelector('#rol');

    //Realizo una validación simple de acuerdo al contenido del value del input del nombre
    if(inputName.value.trim() !== '' && inputEmail.value.trim() !== '' && inputPassword.value.trim() !== ''){
        //Busca en localstorage el item registros, si no existe asigna el array vacio.
        let registros = JSON.parse(localStorage.getItem('registros')) || [];

        //Si el input de ID es distinto de vacio, es porque se trata de una acción de UPDATE
        if(inputId.value!==""){
            //Busco dentro del array de registros el objeto a editar
            const registroFind = registros.find(registro => registro.id == inputId.value);
            //Si existe actualizo el objeto
            if (registroFind) {
              registroFind.name = inputName.value;
              registroFind.email = inputEmail.value;
              registroFind.password = inputPassword.value;
              registroFind.rol = inputRol.value;
            }
        }else{
            let newRegistro = new Registro(
                registros.length + 1,
                inputName.value,
                inputEmail.value,
                inputPassword.value,
                inputRol.value,
            );
            registros.push(newRegistro);
        }

        //Se actualiza el array de registros en el localstorage
        localStorage.setItem('registros',JSON.stringify(registros));
        showRegistros();
        //Se limpian los inputs del formulario
        form.reset();
        Swal.fire({
            title: 'Exito!',
            text: 'Operacion exitosa.',
            icon: 'success',
            confirmButtonText: 'Cerrar'
        })
    }else{
        Swal.fire({
            title: 'Error!',
            text: 'Por favor completa todos los campos.',
            icon: 'error',
            confirmButtonText: 'Cerrar'
        });
    }

}

/**
 * Function que permite cargar el formulario para editar un registro
 * de acuedo al id del registro
 * @param {number} registroId id registro que se va a actualizar
 */
function updateRegistro(registroId){
    let registros = JSON.parse(localStorage.getItem('registros'));
    //se utiliza el metodo find para poder asegurarnos que exista un registro con el id que queremos eliminar.
    let registroToUpdate = registros.find(registro => registro.id === registroId);
    if(registroToUpdate){
        //Se buscan los elementos HTML del input
        const inputId = document.querySelector('#id-registro');
        const inputName = document.querySelector('#name');
        const inputEmail = document.querySelector('#email');
        const inputPassword = document.querySelector('#password');
        const inputRol = document.querySelector('#rol');
        //Se cargan los inputs con los valores del registro encontrado
        inputId.value = registroToUpdate.id;
        inputName.value = registroToUpdate.name;
        inputEmail.value = registroToUpdate.email;
        inputPassword.value = registroToUpdate.password;
        inputRol.value = registroToUpdate.rol;
    }
}

/**
 * Function que permite eliminar un registro del array del localstorage
 * de acuedo al indice del mismo
 * @param {number} registroId id registro que se va a eliminar
 */
function deleteRegistro(registroId){
    let registros = JSON.parse(localStorage.getItem('registros'));
    
    let registroToDelete = registros.find(registro => registro.id === registroId);
    if(registroToDelete){
        
        registros = registros.filter(registro => registro.id !== registroToDelete.id);
       
        localStorage.setItem('registros',JSON.stringify(registros));
        showRegistros();
        Swal.fire({
            title: 'Exito!',
            text: 'El registro fue eliminado.',
            icon: 'success',
            confirmButtonText: 'Cerrar'
        })
    }
}


document.addEventListener('DOMContentLoaded',function(){
    const btnSaveRegistro = document.querySelector('#btn-save-registro');
    
    btnSaveRegistro.addEventListener('click',saveRegistro);
    showRegistros();
});