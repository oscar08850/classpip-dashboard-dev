# OBJETIVO: Asignar un cromo en específico o un paquete de cromos aleatorios.

<!-- asignar-cromos.component.ts -->

Recuperaremos la colección y el juego seleccionado que enviamos al servicio en juego-de-coleccion-seleccionado-activo.component.ts. Por lo que recibiremos la coleccion del servicio y el juego y los metemos en el parámetro coleccion y juegoSeleccionado respectivamente. 

Después activaremos la función CromosColeccion(). Diferenciamos entre modo individual (cargando los alumnos) o no (cargamos los equipos).

# applyFilter() applyFilterEquipo()


# CromosColeccion()

Esta función ha sido explicada en componente de equipos en el README-editar-coleccion.md.

# isAllSelected() masterToggle() toggleCheckbox() checkboxLabel() Seleccionar() SeleccionarTodos() isAllSelectedEquipos() masterToggleEquipos() toggleCheckboxEquipo() checkboxLabelEquipo() SeleccionarEquipo() SeleccionarTodosEquipos()

Esta función ha sido explicada en componente de equipos en el README-editar-grupo.md.

# BotonDesactivado() Disabled()

El botón de asginar cromo estará desactivado si no se ha asignado ningún alumno o equipo, o elegido un cromo o paquete de cromos.

# RecuperarInscripcionesAlumnoJuego() RecuperarInscripcionesEquiposJuego()

Esta función ha sido explicada en componente de equipos en el README-juego-de-coleccion-seleccionado-activo.md.

# AsignarCromo()
 
Al hacer click en el botón del apartado de cromo específico, si el modo es individual llama a la función AsignarCromoAlumnos() sino llama a la AsignarCromoEquipos().

# AsignarCromoAlumnos()

Le entra el cromo seleccionado y asigna al alumno el cromo.

# AsignarCromoEquipos()

Le entra el cromo seleccionado y asigna al equipo el cromo.

# AsignarCromosAleatorios()
 
Al hacer click en el botón del apartado de paquete de cromos, si el modo es individual llama a la función AsignarCromoAlumnos() sino llama a la AsignarCromoEquipos().

# randomIndex()

Elige los cromos que asignar aleatoriamente.

# AsignarCromosAleatoriosAlumno()

Los cromos seleccionados aleatoriamente son asignados al alumno.

# AsignarCromosAleatoriosEquipo()

Los cromos seleccionados aleatoriamente son asignados al equipo.

# AlumnosDelEquipo()

Esta función ha sido explicada en componente de equipos en el README-juego-de-coleccion-seleccionado-activo.md.

# AbrirDialogoConfirmacionAsignarCromo()

Al cerrarse llama a la función AsignarCromo().

# AbrirDialogoConfirmacionAsignarCromosAleatorios()

Al cerrarse llama a la función AsignarCromosAleatorios().
