# OBJETIVO: mostrar las colecciones de una manera ordenada y eficaz. Mostraremos la lista de las colecciones y la opción de editarlas o borrarlas.


<!-- mis-colecciones.component.ts -->

Al iniciar el componente recuperamos el id del profesor para mostrar sus colecciones. Buscamos las colecciones que tiene el profesor mediante la función ColeccionesDelProfesor().


# ColeccionesDelProfesor()

Esta función recibe un array con todos las colecciones que forman parte del profesor cuyo identificador pasamos como parámetro y los mete dentro del parámetro coleccionesProfesor.


# CromosEImagenDeLaColeccion()

Recuperamos la imagen de la colección y lo metemos dentro de imagenColeccion. Después buscamos los cromos que tiene la colección.

# EnviarColeccionEditar()

Al desplegar una coleccion tendremos la opción de editarlo o borrarlo. Si decidimos editarlo se abrirá otro componente (editar-coleccion) en el que podremos modificar los cromos que tiene o el nombsre.

# BorrarColeccion()

Esta función hace un DELETE en la api de la coleccion en el que nos encontramos.

# ColeccionesEliminadas()

Recupera todas las colecciones del profesor y hace un bucle recorriendolas todas y borrandondo la coleccion del la lista de colecionesProfesor.

# AbrirDialogoConfirmacionBorrarColeccion()

Funciona de la misma manera que cuando borrabamos un grupo, explicado en el README-grupo.md



