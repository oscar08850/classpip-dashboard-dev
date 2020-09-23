# OBJETIVO: añadir alumnos de una manera cómoda al equipo


<!-- agregar-alumno-equipo.component.ts -->

En este componente solo deberemos diferenciar entre los alumnos que tiene el equipo y los que no tienen equipo y, por tanto, pueden ser elegibles. Ambas listas pueden variar, ya que cuando añadamos a una lista, quitaremos de la otra.

Al principio recibimos a través del data los alumnosEquipo y alumnosSinEquipo, asi como el alumno. Los alumnos se respresentarán igual que en el editar-equipo (misma tabla).


# AgregarAlumnosEquipo(alumnoId)

Esta función hace un POST de una asignacionEquipo uniendo el grupo en el que nos encontramos (sabemos su id) y el alumno que le pasamos. Si tiene exito el POST, actualizamos el alumnosEquipo mediante la función AlumnosDelEquipo y también el alumnosSinEquipo, mediante la función BorrarAlumnoDeListaSinEquipo(alumnoId).

# AlumnosDelEquipo()

Consulta en la base de datos los alumnos del equipo

# BorrarAlumnoDeListaSinEquipo(alumnoId)

Como la lista de los alumnos sin equipo no la sacamos de la base de datos, deberemos actualizarla mediante filtros nosotros. En este caso devolvemos la lista que teneiamos menos el alumno que tenga el identificador igual al que le pasamos como parámetro.

# AgregarAlumnoDeListaSinEquipo(alumno)

Al igual que con la función anterior, si quitamos a un alumno del equipo deberemos meterlo en la lista sin equipos, es decir, hacer un push a alumnosSinEquipo

# BorrarAlumnoEquipo(alumno)

Buscamos la asignación del alumno que queremos borrar del grupo y después la eliminamos. Además añadimos a dicho alumno en la lista de alumnosSinEquipo mediante la función anterior. Después actualizamos la lista de alumnosEquipo mediante la función AlumnosDelEquipo().




<!-- agregar-alumno-equipo.component.html -->

El html de esta página es muy parecido al de la tabla de editar-equipo.component (mirar README-editar.equipo). 

Cambia que ahora diferenciamos entre dos tablas: la de los alumnos del equipo y los alumnos sin equipo. En los alumnos del equipo el icono que saldrá será la basura para eliminarlo del grupo, mientras que en el de alumnos sin equipo saldrá un + para añadirlo al equipo.





