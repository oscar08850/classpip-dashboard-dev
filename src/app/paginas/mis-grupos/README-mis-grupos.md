# OBJETIVO: listar los grupos del profesor mostrando su nombre y descripción y poder acceder a ellos de manera sencilla. Para ello utilizamos una tabla donde la primera columna corresponderá al nombre y la segunda a la descripción


<!-- mis-grupos.component.ts -->

Declaramos las columnas que tendrá la tabla. Como se explican en el OBJETIVO, las displayedColumns serán 'nombre' y 'descripcion'. Además recogeremos la lista de grupos que nos devuelva la base de datos.

Al iniciar el componente preparamos la URL para cuandos seleccionemos un grupo (returnURL). Recuperamos el identificador del profesor de la URL y la convertimos a Number y pedimos la lista de grupos mediante la función GruposDelProfesor();

# GruposDelProfesor()

Hace la consulta a la base de datos de los grupos del profesor cuyo identificador pasamos como parámetro y nos devuelve un array que metemos en el parámetro listaGrupos.

Si el profesor todavía no tiene grupos devuelve undefined.

# EntrarGrupo(grupo)

Si clicamos encima de una fila debemos saber a que grupo estamos clicando para poder enviarlo al grupo.component.ts. Para ello utilizaremos el evento (click) dentro del mat-cell y recuperaremos la información de la fila de la celda que hemos clicado. Enviaremos el grupo entero al que hemos clicado al componente. Para ello, primero deberemos enviar el grupo al servicio.

Utilizaremos el id del grupo para introducirlo en la URL. 

<!-- mis-grupos.component.html -->

Primero de todo podemos ver el titulo de la pantalla: Mis grupos

Después creamos un form, que contendrá la tabla mencionada anteriormente. Esta tabla solo será visible si listaGrupos es diferente de undefined (*ngIf="listaGrupos"). Sino activará el evento llamado Aviso_no_grupos, el cual es un ng-template que se encuentra en la parte final del html, que no es más que un mensaje de que todavía no hay grupos.

Si el profesor tiene grupos creados, entonces cogerá los datos de estos grupos de la listaGrupos (datasource). Creamos tan solo dos columnas. Definiremos las columnas con los nombres que hemos dado en el displayedColums. Pondremos el texto que se verá y después le damos la información en su columna correspondiente

Para todos los grupos de listaGrupos displayamos el nombre (grupo.Nombre) y descripción (grupo.Descripcion)
