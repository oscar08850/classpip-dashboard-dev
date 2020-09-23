# OBJETIVO: Asignar puntos a un alumno o equipo.

<!-- asignar-puntos.component.ts -->


# isAllSelected() masterToggle() toggleCheckbox() checkboxLabel() Seleccionar() SeleccionarTodos() isAllSelectedEquipos() masterToggleEquipos() toggleCheckboxEquipo() checkboxLabelEquipo() SeleccionarEquipo() SeleccionarTodosEquipos()

Esta función ha sido explicada en componente de equipos en el README-editar-grupo.md.

# AsignarPuntos()

Si el juego es modo individual llama a la función AsignarPuntosAlumnos() sino llama a la función AsignarPuntosEquipos().

# AsignarPuntosAlumnos()

Busca el/los alumnos seleccionados y hace un post de los puntos asignados en la base de datos.

# AsignarPuntosEquipos()

Busca el/los equipos seleccionados y hace un post de los puntos asignados en la base de datos.

# POST_HistorialAlumno()

Hace un post del punto en la base datos del historial de puntos del alumno para despues poder mostrearlo o borrarlo.

# POST_HistorialEquipo()

Hace un post del punto en la base datos del historial de puntos del equipo para despues poder mostrearlo o borrarlo.

# OrdenarListaPorPuntos() OrdenarListaEquiposPorPuntos() OrdenarRankingPorPuntos() OrdenarRankingEquiposPorPuntos() AlumnosDelEquipo()

Esta función ha sido explicada en componente de equipos en el README-juego-de-puntos-seleccionado-activo.md

# OrdenarNiveles() BuscarSiguienteNivel() BuscarNivelActual() 

Esta función ha sido explicada en componente de equipos en el README-alumno-seleccionado-juego-de-puntos.md

# BotonDesactivado() Disabled()

El botón de asginar cromo estará desactivado si no se ha asignado ningún alumno o equipo, o elegido un cromo o paquete de cromos.

