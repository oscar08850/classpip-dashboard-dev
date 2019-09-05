# OBJETIVO: mostrar los equipos de una manera ordenada y eficaz. Mostraremos la lista de los equipos y la opción de crear equipo.


<!-- equipo.component.ts -->

Al iniciar el componente recuperamos el id del grupo donde vamos a crear el equipo y los alumnos del grupo que podremos asignar a equipos (o que ya estan asignados). 

También buscamos los equipos que tiene el grupo mediante la función EquiposDelGrupo().


# ///////////////////////////////////////////////////// LISTAR EQUIPOS /////////////////////////////////////////////////////////

# EquiposDelGrupo()

Esta función recibe un array con todos los equipos que forman parte del grupo cuyo identificador pasamos como parámetro y los mete dentro del parámetro listaEquipos.


# AlumnosYLogoDelEquipo()

Recuperamos el logo del equipo y lo metemos dentro de imagenLogo. Después buscamos los alumnos que tiene el equipo

# EnviarEquipoEditar()

Al desplegar un equipo tendremos la opción de editarlo o borrarlo. Si decidimos editarlo se abrirá otro componente (editar-equipo) en el que podremos modificar los alumnos que tiene o el nombre.


# AbrirDialogoConfirmacionBorrar()

Funciona de la misma manera que cuando borrabamos un grupo, explicado en el README-grupo.md

# EliminarEquipo()

Esta función hace un DELETE en la api del equipo en el que nos encontramos. Además también hace un DELETE de todas las "asignacionEquipo" que tenía dicho equipo (mediante EliminarAsginacionesEquipo()) para que no queden POSTs "basura" en la API.

# EliminarAsginacionesEquipo()

Recupera todas las asignacionEquipo del equipo y hace un bucle recorriendolas todas y borrandolas una a una. Si el equipo no tenia asignaciones (alumnos), hace un console.log diciendo que no hay asignaciones.

# EliminarAsignacionesEquipo()

Esta función recupera las asignaciones de los alumnos en el equipo que acabo de borrar y las borra.


# ///////////////////////////////////////////////////// CREAR EQUIPO /////////////////////////////////////////////////////////

# CrearEquipo()

Hago el POST en la base de datos dandole un nombre al equipo (y un logo opcional). Si he creado un equipo pongo el boolean a true. Esto lo hago por si tiro hacia atrás hacer un PUT en vez de un POST al darle a siguiente.

Activo la función ClasificacionAlumno() para distinguir entre los alumnos que tienen equipo y los que no.

Si he cargado un logo (logoCargado = true), hacemos el POST en la base de datos del nombreLogo

# ActivarInput() y ExaminarLogo()

# EditarEquipo()

Si tiramos atrás haremos un PUT en vez de un POST

Funciona igual que en otros componentes, en los cuales esta explicado.

# ClasificacionAlumnos()

Separo entre los alumnos que tienen un equipo y los que no. Para eso busco las asignaciones. Si tiene asignaciones en ese grupo significa que tiene equipo, sino no es asignable a un equipo. Para ello se activa la función AlumnosAsignables()

# AlumnosAsignables()

Busco si tiene asignacion o no dentro del grupo. Si tiene asingacion lo ponemos en alumnosConEquipo, sino en alumnosSinEquipo

# AbrirDialogoAgregarAlumnosEquipo()

Abre un diálogo que nos permite asignar alumnos a equipos de manera muy simple, clicando a botones de las tablas.

# AlumnosEquipoCreado()

Una vez creamos un equipo nuevo, actualizamos la tabla buscando sus alumnos


# BorrarAlumnoEquipo()

Buscamos la asignación que une al alumno a ese equipo. Una vez la tenemos, la eliminamos. Después borramos al alumno de la lista de alumnosConEquipos y lo añadimos en alumnosSinEquipo mediante la función AlumnoBorrado()

# AlumnoBorrado()

Si borramos un alumno del equipo, borramos si asignación y lo eliminamos de la lista de alumnosConEquipo y lo añadimos a la lista de alumnosSinEquipo.


# Finalizar()

Nos pone todos los valores como al principio y nos devuelve a la lista.

<!-- equipo.component.html -->

Separamos el crear equipos y el listar equipos por un mat-tab. 

En listar equipos tendremos una lista expandible en la que veremos la imagen del equipo (si tiene) y los miembros del equipo, además de las opciones de editar y eliminar. En el caos de clicar en editar nos abrirá el componente editar-equipo. Si le damos a eliminar se nos abrirá el diaálogo de confirmar.

En el caso de crear dispondremos de un stepper de tres pasos:
  1 - Nombre y logo del equipo
  2 - Alumnos del equipo
  3 - Finalizar


