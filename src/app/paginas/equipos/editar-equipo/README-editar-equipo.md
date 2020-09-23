# OBJETIVO: editar de una manera fácil el equipo, focalizandonos en agregar/mover/eliminar alumno del equipo


<!-- editar-equipo.component.ts -->

En este componente es importante diferenciar entre 4 grupos de alumnos distinos:

  - alumnos que pertencen al grupo, es decir, los alumnos totales: alumnosGrupo
  - alumnos del equipo, son aquellos que pertenecen al equipo en particular donde hemos entrado: alumnosEquipo
  - alumnos con equipo, son aquellos alumnos dentro del grupo que pertenecen a algun equipo del grupo: alumnosConEquipo
  - alumnos sin equipo, son aquellos alumnos que no tienen equipo y son elegibles: alumnosSinEquipo

Los alumnos del grupo los recibimos del servicio ya que no van a variar durante la edición del equipo. 

También al iniciar el componente consultamos a la API y recuperamos los alumnos del equipo en el momento de abrir el componente. Estos alumnos pueden cambiar al editar el equipo, ya que podemos añadir/eliminar alumnos.

Asi pues, debemos hacer una clasificación entre los alumnos que tienen equipo y los que no, ya que podrán ser elegidos en otro equipo. Para eso ejecutamos la función ClasificacionAlumnos();


# ClasificacionAlumnos()

Esta función recupera todas las asignaciones del grupo en el que nos encontramos. Si encuentra asignaciones las mete en el parámetro asignacionEquipo y, haya o no asignaciones, ejecuta la función AlumnosAsignables().

# AlumnosAsignables()

Recorre todos los alumnos del grupo uno por uno. Si ha encontrado asignaciones en la función prévia, entonces busca (mediante la función BuscarAlumnosAsignacionEquipo) si ese alumno tiene alguna asignación en ese grupo. Si tiene alguna asignación signfica que ya tiene equipo y, por tanto, lo meto en la lista de alumnosConEquipo. 

Si por el contrario no encuentra ninguna asignación correspondiente con el identificador del alumno, significa que no tiene equipo y los metemos en alumnosSinEquipo.

Si no habia asignaciones en el grupo, significa que todos los alumnos son elegibles y, por tanto, todos son alumnosSinEquipo.

# BuscarAlumnosAsignacionEquipo(alumnoId)

Esta función recibe como parámetro el identificador del alumno y devuelve true o false en función de si encuentra alguna asignacion dentro del parámetro asignacionEquipo en el que el alumnoId conincida el identificador del alumno que le pasamos.

# AlumnosDelEquipo()

Consulta en la base de datos los alumnos del equipo. Se utiliza para actualizar el parámetro alumnosEquipo y, por tanto, la tabla.

# AlumnoBorrado()

Si borramos a un alumno del equipo deberemos de pasarlo de la lista de alumnosConEquipo a alumosSinEquipo. Para ello se usan filters para borraro de la primera lista y se utiliza el push para añadirlo a la segunda. Esta función se ejecutará cuando se borre el alumno de la API.

# BorrarAlumnoEquipo()

Busca en la base de datos la asignacionEquipo que vincula al alumno y el equipo del que lo queremos borrar. Una vez la encuentra, hace un DELETE y ejecuta la función anterior (AlumnoBorrado()). Si lo borra correctamente, actualiza la tabla mediante la función AlumnosDelEquipo().

# AbrirDialogoAgregarAlumnosEquipo()

Abrirá el componente agregar-alumno-equipo enviandole los alumnos del equipo y los alumnos sin equipo (los que pueden ser escogidos), además del equipo. Solo nos interesan los alumnos que pueden ser elegidos, no los que no.

Al cerrar el dialogo, recuperaremos los alumnos del equipo que pasamos del componente agregar-alumno-equipo. Si fuese undefined (si clicamos fuera del dialog se cierra sin enviar nada, aunque ahora se ha puesto que no se pueda) llamaría a la función AlumnosDelEquipo.

Limpiaremos los array de los alumnos con y sin equipo y volveremos a hacer la clasificación después de cerrar el componente de agregar alumno.

# EditarEquipo()

Se hace un PUT del equipo seleccionado para editar

# AbrirDialogoMoverAlumno()

Se abre un dialogo para mover los alumnos de equipo. Le pasamos los alumnos del Equipoy y el equipo.

Al cerrar el dialogo recuperamos los alumnos de ese equipo, reiniciamos las listas de alumnos con equipos y sin equipos y volvemos a buscar la clasificación de éstos.

<!-- editar-equipo.component.html -->

Aparecerá el titulo de editar equipo y un separador (mat-divider). Después dos párrafos con Nombre: (en negrita) y el nombre del equipo, el cual aparecerá por defecto el que tiene actualmente el equipo.

Si clicamos en agregar alumnos se nos abrirá el diálogo agregar-alumno-equipo.

Después aparecerá una tabla con los alumnos que pertencen el equipo de la misma manera que cuando listábamos alumnos en el grupo.component.html con un pequeño cambio. Aparece una columna nueva con el icono de una papelera roja. Si clicamos en ella borraremos al alumno del equipo.

Si nos situamos encima de la papelera nos dará información de lo que haremos si clicamos.

Tendremos un botón para abrir el diálogo para mover alumnos entre los diferentes equipos.



