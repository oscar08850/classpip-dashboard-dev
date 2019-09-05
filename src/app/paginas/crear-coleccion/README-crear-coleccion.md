# OBJETIVO:  dirigir al profesor de la manera más clara y sencilla posible en el proceso de creación. Como la creación consta de varios pasos, nos hemos decantado por un stepper. Crearemos la coleecion y añadiremos los cromos de manera muy simple.


<!-- crear-coleccion.component.ts -->

Al iniciar el crear-coleccion recuperaremos el profesorId de la URL, el cual será un string. Para convertir un string en number utilizamos el método Number, por defecto en Visual Code. 

También iniciamos la URLVueltaInicio, la cual nos enviará a la pantalla de inicio una vez acabado de crear la colección.

Los formGruop los usamos para el stepper del html. Tendremos un stepper con tres pasos. Recogeremos información del primero, así que crearemos un formGroup (myForm) el cual tendrá un input (nombre). El segundo paso también recogeremos información por lo que  así que crearemos un formGroup (myForm2), tendrá tres inputs (nombre, nivel y probabilidad).  

El mat-form-field requiere de controladores. El primer paso deberá tener un controlador, para el nombre (nombreColeccion). En el segundo paso deberá tener un controlador, para el nombre (nombreCromo). 

# CrearColeccion()

Hago el POST en la base de datos dandole un nombre la coleccion (y un logo).

Si he cargado un logo (imagenColeccionCargado = true), hacemos el POST en la base de datos del nombreImagenColeccion.

# EditarColeccion()

Si tiramos atrás haremos un PUT en vez de un POST.

Funciona igual que en otros componentes, en los cuales esta explicado.

# AgregarCromoColeccion() 

Hago el POST en la base de datos dandole un nombre del cromo, el nivel y la probabilidad (y una imagen). 

Activo la función CromosAgregados() para listar los cromos que se han añadido a la colección.

Si he cargado un logo (imagenCromoCargado = true), hacemos el POST en la base de datos del nombreImagenCromo.

# CromosAgregados()

Mete la lista de cromos agregados el cromo recien añadido para mostrarlos en una tabla.

# LimpiarCampos()

Pone todos los campos como al principio.

# BorrarCromo()

Hace un DELETE de la base de datos del cromo que le pasamos. Además activa la función CromosEliminados().

# CromosEliminados()

Filtra la lista de puntosAgregados quitando el punto que acabamos de eliminar.

# ActivarInputColeccion() y ExaminarImagenColeccion()
# ActivarInputCromo() y ExaminarImagenCromo()


# OpcionProbabilidadSeleccionada() y OpcionNivelSeleccionado() 

Una vez elegido la probabilidad y el nivel se asigna a la variable probabilidadCromo y nivelCromo respectivamente.

# Disabled()

Esta función se utiliza para controlar si el botón de siguiente del stepper esta desativado. Si en alguno de los inputs no hay nada, esta disabled. Sino, podremos clicar.

# Finalizar()

Esta funcion se ejecuta en el tercer step y se reinicia todas las variables.
