# OBJETIVO: el objetivo es crear accesos directos a los componentes principales de la app desde cualquier componente.

<!-- navbar.component.ts -->

No sabemos porque el componente navbar no recuperaba la URL donde viajaba el app-router. Por eso declaramos la URL del incio y sus routers hasta los componentes principales.

Además recibe el profesor que ha iniciado sesión y se colocara su nombre en la parte derecha del navbar.

<!-- navbar.component.html -->

Mostramos un navbar con la imagen de classpip y varios botones desplegables. Cada uno tiene un routerLink.

Para añadir una nueva opción a la barra de navegación hay que dar los pasos siguientes:
  1. Crear el componente al que queremos saltar (por ejemplo: NuevoComponente)
  2. Añadir una ruta en navbar.component.ts:    
            this.URLNuevo = this.URLInicio + '/nuevo';  
  3. Añadir el boton en el navbar.component.html:
  
    <button routerLink = {{URLNuevo}} mat-button [matMenuTriggerFor]="Nuevo" class="btnNavbarAmarillo"> Nuevo </button>
    <mat-menu  #Nuevo="matMenu">
    </mat-menu>

  4. Añadir la ruta en el routing.module:
    { path: 'inicio/:id/nuevo', component: NuevoComponente },


Este componente tiene RouterLinks a los siguientes:
  MisGrupos
  CreaGrupo
  MisPuntos
  CreaPuntos
  MisColecciones
  CreaColeccion
  Desarrolladores
  ConfiguracionProfesor

