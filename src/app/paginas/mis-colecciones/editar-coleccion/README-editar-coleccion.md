# OBJETIVO: editar la información de la colección o sus cromos de manera sencilla


<!-- editar-coleccion.component.ts -->

Recibimos la coleccion al iniciar el componente.

Los parámetros de nombreColeccion y imagenColeccion los asociamos a los dos inputs que tenemos. Al principio serán iguales a al nombre y la imagen actual de la coleccion, por eso los igualamos.

# EditarColeccion()

Se hace un PUT de la colección seleccionado para editar

# GET_Imagen()

Busca la imagen de la colección que tiene el nombre del coleccion.ImagenColeccion y lo carga en imagenColeccion

# GET_ImagenCromo()

Busca la imagen de todos los cromos que tiene el nombre del cromo.Imagen y lo carga en imagenCromoArray

# OrdenarCromos()

Ordena los cromos por nombre. 

# ActivarInput() Mostrar()

# AbrirDialogoAgregarCromoColeccion()

Tendremos un botón que abre el diálogo para añadir los cromos (agregar-cromo-dialog).Explicación README-agregar-cromo-dialog.md. Al cerrar el diálogo ejecutaremos la función CromosEImagenDeLaColeccion() para actualizar la lista de cromos.

# EnviarCromoEditar()

Una vez seleccionado un cromo, lo podemos editar o eliminar. Esta función se activará si clicamos en editar. Envía el cromo específico al componente editar-cromo.

# AbrirDialogoConfirmacionBorrarCromo()

Abrimos el componente para confirmar que quiero eliminar el cromo seleccionado.

# BorrarCromo()

Utilizamos esta función para eliminar un cromo de la base de datos y actualiza la lista de cromos.

# CromosEImagenDeLaColeccion()

Esta función ya esta explicada en el README-mis-colecciones.md, y sirve para una vez editado o añadido un cromo si actualize la colección.
