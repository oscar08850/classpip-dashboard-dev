# OBJETIVO: Crear juego de coleccion.

<!-- asignacion-coleccion-juego.component.ts -->

Recuperaremos el juego y los alumnos del grupo que enviamos al servicio en juego.component.ts. Por lo que recibiremos el juego del servicio y los alumnos y los metemos en el parámetro juego y alumnos respectivamente. 

Después activaremos la función EquiposDelGrupo() y GET_ListaColecciones().

# EquiposDelGrupo()

Recupera los equipos del grupo y los guarda en el array equiposGrupo.

# applyFilter() highlight()

# GET_ListaColecciones()

Recibe del servicio el ID del profesor y llama a la función ListaDeColecciones()

# ListaDeColecciones()

Hace una consulta a la base de datos sobre las colecciones del profesor y las guarda en el array colecciones.

# ColeccionSeleccionada()

Al hacer click encima de la colección se queda selecionada como la que se va utilizar en el juego.

# AsignarColeccionJuego()

Hace un PUT en el juego una vez se ha seleccionado la colección. Despues llama a la función InscribirParticipantesJuego()

# InscribirParticipantesJuego()

Inscribe a los alumnos o los equipos dependiendo del modo elegido en el juego de colección.

# AbrirDialogoMostrarCromos()

Abre un dialog para mostrar los cromo que tiene la colección seleccionada.
