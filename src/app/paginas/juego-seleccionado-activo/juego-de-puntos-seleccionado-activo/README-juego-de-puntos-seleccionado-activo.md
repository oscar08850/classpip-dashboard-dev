# OBJETIVO: Mostrar el juego de puntos activo.

<!-- juego-de-puntos-seleccionado-activo.component.ts -->

Recuperaremos el juego que enviamos al servicio en juego.component.ts. Por lo que recibiremos el juego del servicio y los metemos en el parámetro juegoSeleccionado. 

Cargaremos la función PuntosDelJuego() y NivelesDelJuego().

Después activaremos la función AlumnosDelJuego() o EquiposDelJuego() dependiendo si el modo es individual o no.

# AlumnosDelJuego()

Recupera los alumnos del juego y los guarda en el array alumnosDelJuego. 

# EquiposDelJuego()

Recupera los equipos del juego y los guarda en el array equiposDelGrupo.

# PuntosDelJuego()

Recupera los puntos que se pueden asignar en el juego

# NivelesDelJuego()

Recupera los niveles de los que dispone el juego.

# RecuperarInscripcionesAlumnoJuego()

Recupera las inscripciones de los alumnos en el juego y los puntos que tienen y los ordena de mayor a menor valor.

# RecuperarInscripcionesEquiposJuego()

Recupera las inscripciones de los equipos en el juego y los puntos que tienen y los ordena de mayor a menor valor.

# OrdenarPorPuntos()

Recoge la lista y la ordena por puntos de mayor a menor.

# OrdenarPorPuntosEquipos()

Recoge la lista y la ordena por puntos de mayor a menor.

# TablaClasificacionTotal()

En función del modo, recorremos la lisa de Alumnos o de Equipos y vamos rellenando el rankingJuegoDePuntos.

# BuscarAlumno()

Se le da el ID del alumno y devuelve al alumno.

# BuscarEquipo()

Se le da el ID del equipo y devuelve el equipo.

# BuscarNivel()

Se le da el ID del nivel y devuelve el nivel.

# Informacion()

Envia los puntos y los niveles al servicio.

# AsignarPuntos()

Envia todos los parametros necesarios al servicio para asignar los puntos.

# AccederAlumno()

Envia al servicio al alumno y la inscripción del alumno que se ha seleccionado, para obtener más información.

# AccederEquipo()

Envia al servicio al equipo y la inscripción del equipo que se ha seleccionado, para obtener más información.

# MostrarRankingSeleccionado() 

Inicialmente se muestra el ranking con los puntos totales.

# ClasificacionPorTipoDePunto() OrdenarTablaPorPuntos()

Clasifica los alumnos o los equipos dependiendo el tipo de punto que se seleccione.

# AlumnosDelEquipo()

Esta función ha sido explicada en componente de equipos en el README-equipos.md.


# DesactivarJuego()

Hace un PUT en la api del estado del juego y 

# AbrirDialogoConfirmacionDesactivar()

Abrimos el componente para confirmar que quiero desactivar el juego.
