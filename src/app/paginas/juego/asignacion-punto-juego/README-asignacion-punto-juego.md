# OBJETIVO: Crear juego de puntos.

<!-- asignacion-punto-juego.component.ts -->

Recuperaremos el juego y el ID del grupo que enviamos al servicio en juego.component.ts. Por lo que recibiremos el juego del servicio y el grupo ID y los metemos en el parámetro juego y grupoID respectivamente. 

Después activaremos la función RecogerPuntos().

# RecogerPuntos()

Recupera el ID del profesor y llama a la función PuntosParaAsignar().

# PuntosParaAsignar()

Recupera los equipos del grupo y los guarda en el array puntosSeleccionables.

# isAllSelected() masterToggle() toggleCheckbox() checkboxLabel() Seleccionar() SeleccionarTodos()

Las anteriores funciones han sido descritas en el apartado README-editar-grupo.md.

# AgregarPuntosAlJuego()

Una vez se han seleccionado los puntos que se quieren utilizar en el juego, se utiliza esta función para asignarlos.
