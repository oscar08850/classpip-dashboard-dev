# OBJETIVO: Crear juegos y visualizar los juegos activos e inactivos.

<!-- juego.component.ts -->

Recuperaremos el grupo ID y los alumnos del grupo que enviamos al servicio en grupo.component.ts. Por lo que recibiremos el grupoID del servicio y lo metemos en el parámetro grupoID. 

Después activaremos la función EquiposDelGrupo() y ListaJuegosDePuntos().

# ///////////////////////////////////////// LISTA DE JUEGOS  //////////////////////////////////////////////////

# ListaJuegosDePuntos()

Recupera la lista de juegos que tiene el grupo (primero el de puntos, después de colección y después los totales) y los va clasificando en activo e inactivo.

# ListaJuegosDeColeccion()

Lista de juegos de colecciones que tiene el grupo y los clasifica en activo e inactivo.

# ListaJuegosDeCompeticion()

Lista de juegos de competicion que tiene el grupo y los clasifica en activo e inactivo.

# ListaJuegosTotales()

Una vez obtenidos todos juegos activos e inactivos se introducen en dos arrays globales uno para los juegos activos (todosLosJuegosActivos) y otro para los juegos inactivos (todosLosJuegosInactivos).

# ListaJuegoSeleccionado()

Dependiendo de la opción seleccionada del tipo de juego que se quiere mostrar, se asigna los juegos de ese tipo a los arrays ListaJuegosSeleccionadoActivo y ListaJuegosSeleccionadoInactivo.

# JuegoSeleccionado()

Al seleccionar el juego, lo enviamos al servicio.



#   ///////////////////////////////////////// CREAR JUEGO ///////////////////////////////////////////////

# EquiposDelGrupo()

Recupera los equipos del grupo y los guarda en el array equiposGrupo.

# TipoDeJuegoSeleccionado()

Recoge el tipo de juego seleccionado y lo mete en la variable (tipoDeJuegoSeleccionado), la cual se usará después para el POST del juego.

# ModoDeJuegoSeleccionado()

Recoge el modo de juego seleccionado y lo mete en la variable (modoDeJuegoSeleccionado), la cual se usará después para el POST del juego. (Se puede elegir entre alumnos o equipos)

# CrearJuegoDePuntos()

Hago el POST en la base de datos dandole el tipo de juego, un modo de juego y el grupodID.

# CrearJuegoDeColeccion()

Hago el POST en la base de datos dandole el tipo de juego, un modo de juego y el grupodID.

# CrearJuegoCorrespondiente()

Si decidimos crear un juego de puntos, lo crearemos ya en la base de datos y posteriormente le añadiremos puntos y niveles.

Si decidimos crear un juego de colección no haremos el POST en este paso, sino en el siguente cuando indiquemos la colección.

Si decidimos crear un juego de competición tampoco haremos el POST en este paso, sino cuando indiquemos el tipo de competición.

# InscribirAlumnosJuego()

Inscribe a los alumnos en el juego corresponiente en la base de datos

# InscribirEquiposJuego()

Inscribe a los equipos en el juego corresponiente en la base de datos

# Finalizar()

Una vez finalizada la creacion del juego todas las variables se reinician y se vuelva a listar todos los juegos activos e inactivos.
