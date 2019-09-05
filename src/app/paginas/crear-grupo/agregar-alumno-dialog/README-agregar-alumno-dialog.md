# OBJETIVO: intuitividad y sencillez a la hora de añadir un alumno nuevo. Por eso dispondremos de tres entradas para poner nombre, primer y segundo apellido del alumno y añadirlo. Cuando lo añadamos, se nos borrarán los inputs para que podamos añadir otro.


<!-- agregar-alumno-dialog.component.ts -->

Al iniciar el componente recibo los datos que le he pasado cuando abría el diálogo (data). Accederé a esos parámetros utilizando data. antes del nombre del parámetro.

Crearemos un formGroup con tres controladores: nombreAlumno, primerApellido y segundoApellido. Como ya se ha explicado en el README-crear-equipo, en el controlador asignaré los valores que entren en los inputs.

Hay que tener en cuenta que a este diálogo se le podrá llamar tanto des de el componente de crear-equipo como del de editar-equipo, ya que no es obligatorio añadir los alumnos cuando se crea el grupo, se pueden añadir a posteriori.


#MatricularAlumno()

Esta función hace un POST en la base de datos uniendo a un alumno registrado en la base de datos con un grupo ya existente. Le pasaremos la nueva matrícula solo indicando el alumnoId y el grupoId a la función POST_Matricula del MatriculaService. Una vez hayamos recibido que la matrícula se ha hecho correctamente, haré un reset de los inputs del form.


#AgregarAlumnoNuevoGrupo()

Esta función se utilizará cuando queramos añadir un alumno nuevo al grupo, es decir, que no se encuentre en la base de datos del profesor. Lo registrará y después lo matriculará en el grupo al que lo queremos añadir

Recoge los valores que introducimos como inputs y hace un POST del alumno en la base de datos mediante la función POST_AlumnosAlProfesor del AlumnoService. Recogemos el Observable y lo ponemos en el parámetro alumno y matriculamos dicho alumno nuevo en el grupo al que lo estamos añadiendo. 



# BuscarAlumnoBaseDeDatos()

Antes de meter a un alumno en un grupo debemos comprobar si éste ya se encuentra registrado en la base de datos o no. Esto se hace porque so ya esta registrado utilizaremos al mismo alumno, sinó haríamos diferentes POSTs para un mismo alumno. 
 
La función recoge los parámetros que introducimos y busca si hay algún alumno en la base de datos con esos mismos datos (nombre, primer y segundo apellido). Esto se hace mediante un GET utilizando filtros con la función GET_AlumnoConcreto del AlumnoService. En caso de que la suscripción (respuesta) devuelva algo diferente de undefined, significa que ha encontrado al alumno y solo lo matricularemos en el grupo al que lo queremos añadir. 

En caso de no encontrar al alumno, lo agregaremos y lo matricularemos (la matricula se hace en la misma función de AgregarAlumnoNuevoAlGrupo()).



<!-- agregar-alumno-component.html -->

Primero de todo encontramos el titulo del diálogo. Después ponemos un párrafo con una indicación de lo que hay que hacer.

Debajo pondremos un form con el ngSubmit de BuscarAlumno() e indicando el [formGroup] de donde vendrán los controladores. Al clicar al botón asignado al form, se llevará a cabo la función del ngSubmit, haciendo todo lo explicado anteriormente.

Pondremos 3 mat-form-field, uno para cada parámetro de entrada, con su respectivo controlador.
