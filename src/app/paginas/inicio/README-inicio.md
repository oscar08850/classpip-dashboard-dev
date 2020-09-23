# OBJETIVO: En el inicio mostraremos un menú con las diferentes opciones que tiene el profesor. Para ello deberemos saber que profesor ha iniciados sesión.


<!-- inicio.component.ts -->
Al iniciar el componente recuperaremos el profesor que pasamos del componente login y lo asignamos al parámetro profesor del componente inicio. 

Inicio solo tiene la función goBack() que nos regresará a la página de la que venimos, es decir, al login.

<!-- inicio-component.html -->
Si la variable profesor es diferente de null (*ngIf = “profesor”), mostraremos el titulo “Sesión iniciada por profesor:” y el nombre del profesor

El profesor dispondrá de un menú con desplegables. En función de donde clique nos dirigirá a una página u otra. 
