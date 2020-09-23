# OBJETIVO:  dirigir al profesor de la manera más clara y sencilla posible en el proceso de creación. Como la creación consta de varios pasos, nos hemos decantado por un stepper. Crearemos el grupo y añadiremos alumnos de manera muy simple.


<!-- crear-grupo.component.ts -->

Al iniciar el crear-grupo recuperaremos el profesorId de la URL, el cual será un string. Para convertir un string en number utilizamos el método Number, por defecto en Visual Code. 

También iniciamos la URLVueltaInicio, la cual nos enviará a la pantalla de inicio una vez acabado de crear el grupo.

Los formGruop los usamos para el stepper del html. Tendremos un stepper con tres pasos. Solo recogeremos información del primero, así que crearemos un formGroup (myForm) el cual tendrá dos inputs (nombre y descripción). El segundo paso tendrá un botón que abrirá un diálogo.  

El mat-form-field requiere de controladores. El primer paso deberá tener dos controladores, uno para el nombre (nombreGrupo) y otro para la descripción (descripcionGrupo). 

En el segundo paso nos da igual el controlador, ya que utilizaremos un botón. Por eso el segundo paso no será un mat-form-field.


# CrearEquipo()

Para crear un equipo tendremos dos inputs donde introduciremos el nombre y la descripción. Como se ha explicado anteriormente, estos inputs son los controladores. Así pues serán los valores de los controladores del formGroup "myForm" (myForm.value). Después utilizamos la función POST_Grupo del GrupoService que hace un POST en la base de datos.

El POST nos devuelve un Observable de la clase Grupo (res) que metemos en el parámetro grupo del componente crear-grupo. Además tenemos un Boolean llamado grupoYaCreado iniciado en false. Cuando creemos el equipo por primera vez, lo pondremos true. 

Esto lo utilizaremos porque escribimos el nombre y la descripción en el primer paso del stepper. Al clicar al botón de siguiente para pasar al segundo paso, llamaremos a la función de CrearEquipo() y haremos el POST en la base de datos. En la pantalla del segundo paso tenemos la opción de volver hacia atrás, lo que nos devolvería al paso de crear equipo. Si volvemos hacia atrás nos encontraremos en los inputs los parámetros del grupo que acabamos de crear. Si quisiéramos cambiar uno de los parámetros porque nos hemos equivocado, deberíamos hacer un PUT del grupo que acabamos de crear, es decir, editarlo. Entonces, cuando cliquemos en siguiente, ya no llamaríamos a la función CrearEquipo(), sino a la de EditarEquipo(). 

Para saber si tengo que hacer un PUT o un POST deberé saber si el grupo ya se ha creado (PUT) o no (POST). Por eso utilizamos ese Boolean.

# EditarGrupo()

Como editamos el grupo que acabamos de crear y hemos recuperado ese grupo con la suscripción al Observable y lo hemos metido en el parámetro grupo, utilizaremos el id del grupo para hacer un PUT de ese grupo determinado. 

Es todo igual a cuando creamos un equipo solo que indicamos el grupo particular donde haremos el PUT y utilizaremos la función PUT_Grupo del GrupoService .

# AbrirDialogoAgregarAlumnos()

Esta función se utilizará en el segundo paso, el cual es opcional. El profesor puede decidir crear el grupo vacío y ya lo podrá ver en Mis Grupos y posteriormente añadir los alumnos. 

En estos momentos en el segundo paso aparecerá un botón de añadir alumnos que abrera un dialogo donde podremos introducir manualmente los alumnos. Este diálogo es otro componente nuevo (AgregarAlumnoDialogComponent), el cual se encuentra dentro de la carpeta crear-grupo. Le pasaremos a ese componente el grupoId y el profesorId a través del data. 

# VueltaInicio()

Esta función se activará si clicamos en el botón "Finalizar" del último paso de la creación del grupo y nos devolverá a la pantalla de inicio del profesor.

# Disabled()

Esta función se utiliza para controlar si el botón de siguiente del stepper esta desativado. Si en alguno de los inputs no hay nada, esta disabled. Sino, podremos clicar.
