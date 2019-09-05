# OBJETIVO: Visualizar la información del grupo en el que hemos entrado de manera clara (nombre, descripción y lista de alumnos) y las diferentes opciones que tenemos con dicho grupo.


<!-- grupo.component.ts -->

Al iniciar el componente introducimos los parámetros que vamos a mostrar en la tabla de los alumnos en displayedColumns, al igual que en el mis-grupos con los grupos.

Recuperaremos el grupo que enviamos al servicio en mis-grupos.component.ts. Por lo que recibiremos el grupo del servicio y lo metemos en el parámetro grupoSeleccionado. También recuperamos el profesorId del mismo grupoSeleccioando.

El mensaje se lo pasaremos al componente dialogo-confirmacion dentro de la carpeta COMPARTIDO. Ese componente siempre recibirá un mensaje, particularizado para cada caso.

Después activaremos la función AlumnosDelGrupo().


# AlumnosDelGrupo()

Esta función recibe un array con todos los alumnos que forman parte del grupo cuyo identificador pasamos como parámetro y los mete dentro del parámetro alumnosGrupoSeleccionado.


En la pantalla veremos las 5 opciones que tenemos con el grupo mediante botones correspondientes a: Editar grupo, pasar lista, equipos, juegos, eliminar grupo.

# EntrarEditarGrupo()

Esta función vuelve a enviar el grupo al servicio para recogerlo en el editar-grupo.component.ts y además tambien envía los alumnos de dicho grupo.

# EntrarEquipos()

Enviamos el grupo seleccionado y los alumnos de dicho grupo al servicio para recogerlo en el equipos.componente.

# EliminarGrupo()

Esta función hace un DELETE en la api del grupo en el que nos encontramos. Además también hace un DELETE de todas las matriculas que tenía dicho grupo para que no queden POSTs "basura" en la API.

# EliminarMatriculas()

Recupera todas las matriculas del grupo y hace un bucle recorriendolas todas y borrandolas una a una. Si el grupo no tenia matriculas, hace un console.log diciendo que no hay matriculas.

# AbrirDialogoConfirmacionBorrar()

Cuando clicamos en el botón "Eliminar Grupo" realmente no ejecutamos la función EliminarGrupo(), sino que ejecutamos esta función, la cual abrirá un diálogo preguntando si estamos seguros de querer borrar. Si le damos a borrar, entonces se ejecutará la función EliminarGrupo() (y, por consiguiente, EliminarMatriculas()). En cambio si le diesemos a cancelar, no haría nada.

Si se borra el grupo nos saldrá un snackBar durante 2 segundos con el mensaje de: {Nombre grupo} + eliminado correctamente.

<!-- grupo.component.html -->

Volvemos a iniciar con el titulo de Mis Grupos. 

Después hacemos un párrafo en el que pondra Nombre en negrita y después el nombre del grupo seleccionado en normal. Lo mismo pasa con Descripción.

Después encontramos los 5 botones con las diferentes opciones que tenemos con el grupo. Algunas tienen el evento click y la ruta (routerLink) que seguiremos. Esta URL es la URL en que nos encontramos + /(lo que pongamos en el routerlink).

Depués mostramos la tabla con los alumnos que tiene el grupo. Esta tabla funciona igual que la de los grupos explicada en README-crear-grupo.md, solo que tiene más columnas. Si no hay alumnos en el grupo nos mostrará el template Aviso_no_alumnos.


