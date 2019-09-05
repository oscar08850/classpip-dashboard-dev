# OBJETIVO: Mostrar el juego de coleccion inactivo.

<!-- juego-de-coleccion-seleccionado-inactivo.component.ts -->

Recuperaremos el juego que enviamos al servicio en juego.component.ts. Por lo que recibiremos el juego del servicio y los metemos en el parámetro juegoSeleccionado. 

Después activaremos la función AlumnosDelJuego() o EquiposDelJuego() dependiendo si el modo es individual o no.

# applyFilter() applyFilterEquipo()

# AlumnosDelJuego()

Recupera los alumnos del juego y los guarda en el array alumnosDelJuego. 

# RecuperarInscripcionesAlumnoJuego()

Recupera las inscripciones de los alumnos en el juego y los puntos que tienen y los ordena de mayor a menor valor.

# EquiposDelJuego()

Recupera los equipos del juego y los guarda en el array equiposDelGrupo.

# RecuperarInscripcionesEquiposJuego()

Recupera las inscripciones de los equipos en el juego y los puntos que tienen y los ordena de mayor a menor valor.

# AlumnosDelEquipo()

Esta función ha sido explicada en componente de equipos en el README-equipos.md.

# AccederAlumno()

Envia al servicio al alumno y la inscripción del alumno que se ha seleccionado, para obtener más información.

# AccederEquipo()

Envia al servicio al equipo y la inscripción del equipo que se ha seleccionado, para obtener más información.
# ColeccionDelJuego()

Recupera la colección de la base de datos y envia la colección al servicio.

# ReactivarJuego()

Hace un PUT en la api del estado del juego y lo pone el parametro true, para indicar que esta activo el juego.

# AbrirDialogoConfirmacionReactivar()

Abrimos el componente para confirmar que quiero reactivar el juego, al cerrarse llama a la función ReactivarJuego().

# EliminarJuego()

Elimina el juego de la base de datos.

# AbrirDialogoConfirmacionEliminar()

Abrimos el componente para confirmar que quiero eliminar el juego, al cerrarse llama a la función EliminarJuego().
