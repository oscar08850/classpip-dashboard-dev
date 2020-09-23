#OBJETIVO: en el componente login introducimos el nombre y apellido del profesor y nos da acceso si este se encuentra en la base de datos o no nos deja entrar si no está.

# Para ello, pondremos dos inputs y un botón.


<!-- login.component.ts -->
Con tal de facilitar el desarrollo de la aplicación, el login actual es muy simple. Dispondremos de dos inputs para poner el nombre y apellido del profesor, los cuales recogeremos para hacer una consulta en la base de datos.

Si hay un profesor registrado con ese nombre y apellido, recuperaremos ese profesor haciendo un GET en la base de datos mediante la función Autentificar(). 

La función Autentificar() utiliza la función AutentificarProfesor del ServicioProfesor, la cual utiliza filtros para encontrar al profesor que tiene ese nombre y apellido. Ésta nos devuelve un Observable (res) de la clase Profesor cuando me suscribo. 

Si el Observable devuelve algo diferente de undefined significa que hemos encontrado al profesor que estábamos buscando y lo meteré dentro del parámetro profesor, que es de la clase Profesor.

Después, nos dirigiremos a la página /inicio/{id}, donde el {id} es el id del profesor que acabamos de recuperar. Así, cada profesor tendrá su pantalla de inicio única. Pasaremos el parámetro profesor, el cual tiene el profesor que acabamos de recuperar, a la pantalla de inicio. Para ello, utilizaremos la función EnviarProfesorAlServicio del ServicioProfesor.

Si no se encuentra el profesor, devolveremos un console.log de que no se ha encontrado.

<!-- login.component.html -->
El html es muy simple. Solo tiene un form con dos inputs y un botón. Cuando le demos al botón se activara la función del (ngSubmit)=Autentificar(). 

Los inputs se asignarán a las variables del (ngModel), “nombre” y “apellido” respectivamente, las cuales deberán estar declaradas en el login-component.ts. Estos parámetros se pasarán a la función AutentificarProfesor del ServicioProfesor.
