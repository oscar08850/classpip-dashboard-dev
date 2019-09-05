# OBJETIVO: mostrar los puntos e insignias de una manera ordenada y eficaz. Mostraremos la lista de los puntos e insignias y la opción de editarlas o borrarlas.


<!-- mis-puntos.component.ts -->

Al iniciar el componente recuperamos el id del profesor para mostrar sus puntos e insignias. Buscamos los puntos que tiene el profesor mediante la función PuntosDelProfesor() y las insignias mediante la función InsigniasDelProfesor().

# ////////////////////////////////////////////// PARA PUNTOS ////////////////////////////////////////////////


# PuntosDelProfesor()

Esta función recibe un array con todos los puntos que forman parte del profesor cuyo identificador pasamos como parámetro y los mete dentro del parámetro puntosProfesor.

# EnviarPuntoEditar()

Al desplegar un punto tendremos la opción de editarlo o borrarlo. Si decidimos editarlo se abrirá otro componente (editar-punto) en el que podremos modificar el nombre o la descripción.

# AbrirDialogoConfirmacionBorrarPunto()

Funciona de la misma manera que cuando borrabamos un grupo, explicado en el README-grupo.md

# BorrarPunto()

Esta función hace un DELETE en la api del punto en el que nos encontramos.

# PuntosEliminados()

Recupera todos los puntos del profesor y hace un bucle recorriendolas todos y borrandondo el punto del la lista de puntosProfesor.

# ////////////////////////////////////////////// PARA INSIGNIAS ////////////////////////////////////////////////

# InsigniasDelProfesor()

Esta función recibe un array con todas las insignias que forman parte del profesor cuyo identificador pasamos como parámetro y los mete dentro del parámetro insigniasProfesor.

# EnviarInsigniaEditar()

Al desplegar una insignia tendremos la opción de editarla o borrarla. Si decidimos editarla se abrirá otro componente (editar-insignia) en el que podremos modificar el nombre, la descripción o imagen.

# AbrirDialogoConfirmacionBorrarInsignia()

# BorrarInsignia()

Esta función hace un DELETE en la api de la insignia en el que nos encontramos.

# InsigniasEliminadas()

Recupera todos las insignias del profesor y hace un bucle recorriendolas todos y borrandondo el punto del la lista de insigniasProfesor.

# ImagenDelaInsignia()

Recuperamos la imagen de la insignia y lo metemos dentro de imagenInsignia.
