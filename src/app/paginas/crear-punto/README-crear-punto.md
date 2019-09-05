# OBJETIVO: crear puntos o insignias de manera simple


<!-- crear-punto.component.ts -->

Al iniciar el componente recibo el identificador del profesor que va a crear los puntos.


/////////////////////////////////////// PUNTO ////////////////////////////

#CrearPunto()

Añadimos un nuevo punto dandole un nombre y una descripción. Una vez hecho el POST activamos la función PuntosAgregados() y LimpiarCampos().


# PuntosAgregados()

Mete la lista de puntos agregados el punto recien añadido para mostrarlos en una tabla.


# LimpiarCampos()

Pone todos los campos como al principio.


# BorrarPunto()

Hace un DELETE de la base de datos del punto que le pasamos. Además activa la función PuntosEliminados().


# PuntosEliminados()

Filtra la lista de puntosAgregados quitando el punto que acabamos de eliminar.

# Disabled()

Si el nombre del punto o su descripción es undefined o vacío, entonces no me dejará hacer click en crear punto.


/////////////////////////////////////// INSIGNIA ////////////////////////////

# ActivarInput()

Activa la función de ExaminarImagen()

# ExaminarImagen()
Examinamos la imagen del ordenador y la cargamos en la base de datos. Pasamos el boolean de logoCargado a true.

# CrearInsignia()

Hacemos el POST de la nueva insignia dandole un nombre y una descripcion (y una imagen opcional). Al igual que con el punto, se activarán las funciones InsigniasAgregadas y LimpiarCamposInsignias, equivalentes a las funciones PuntosAgregados y LimpiarCampos, por lo tanto no se explicarán. El resto de funciones son equivalentes.

<!-- crear-punto.html -->

Un mat-tab separa el crear puntos e insignias. Cada uno esta formado por sus inputs correspondientes y en agregar insignia tiene un botón para agregar foto.
