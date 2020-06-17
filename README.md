# Classpip Dashboard

[![Classpip Badge](https://img.shields.io/badge/classpip-dashboard-brightgreen.svg)](https://github.com/rocmeseguer/classpip-dashboard)
[![Classpip Badge](https://img.shields.io/badge/classpip-mobile--profe-brightgreen)](https://github.com/rocmeseguer/classpip-mobile-profe)
[![Classpip Badge](https://img.shields.io/badge/classpip-mobile--student-brightgreen)](https://github.com/rocmeseguer/classpip-mobile-student)
[![Classpip Badge](https://img.shields.io/badge/classpip-server-brightgreen.svg)](https://github.com/rocmeseguer/classpip-server)
[![Classpip Badge](https://img.shields.io/badge/classpip-services-brightgreen.svg)](https://github.com/rocmeseguer/classpip-services)
[![license](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](https://github.com/classpip/classpip/blob/master/LICENSE)


Classpip es una herramienta para introducir gamificación en el aula. La gamificación consiste en la introducción de las mecánicas típicas de los juegos en escenarios que no son juegos, para motivar a las personas a hacer cosas que quizá no tienen muchas ganas de hacer.

![classpip-arch](https://github.com/classpip/classpip/raw/master/images/project-architecture.png)

En la actualidad Classpip tiene 5 módulos:
 
* *Dashboard*: Es la aplicación web con la que, desde su ordenador, el profesor puede tomar todas las decisiones sobre configuración de los juegos (por ejemplo, crear una colección nueva) e interacción con cada juego (por ejemplo, asignar puntos a los alumnos).
 [![Classpip Badge](https://img.shields.io/badge/classpip-dashboard-brightgreen.svg)](https://github.com/rocmeseguer/classpip-dashboard)

* *Mobile-profe*: Es la app mediante la cual el profesor puede hacer algunas funciones que resulta apropiado hacer desde un dispositivo móvil (por ejemplo, asignar cromos a alumnos concretos o consultar el ranking del juego de puntos).
 [![Classpip Badge](https://img.shields.io/badge/classpip-mobile--profe-brightgreen)](https://github.com/rocmeseguer/classpip-mobile-profe)

* *Mobile-student*: Es la app mediante la cual el alumno interacciona con el juego (por ejemplo, consulta los puntos que tiene, intercambia cromos con los compañeros o responde a las preguntas de un juego de preguntas). 
[![Classpip Badge](https://img.shields.io/badge/classpip-mobile--student-brightgreen)](https://github.com/rocmeseguer/classpip-mobile-student)
  
* *Services*: Es la aplicación que ofrece al resto de módulos los servicios de acceso a datos en modo API-REST  (por ejemplo, obtener la lista de juegos de un grupo, o los cromos que tiene un alumno en su álbum).
 [![Classpip Badge](https://img.shields.io/badge/classpip-services-brightgreen.svg)](https://github.com/rocmeseguer/classpip-services)
 
 * *Server*: Es un servidor que realizar tareas de notificación entre los usuarios. Por ejemplo, recibe la notificación de que un alumno ha completado un cuestionario y remite esa notificación al Dash para que refleje esa circunstancia en el listado de alumnos que participan en el juego. También realiza tareas de registro de actividad (por ejemplo, registrar la creación de grupos o de juegos).
 [![Classpip Badge](https://img.shields.io/badge/classpip-server-brightgreen.svg)](https://github.com/rocmeseguer/classpip-server)


# Dashboard

Este repositorio contiene el código del módulo Dashboard, que es el cuadro de mandos desde el que el profesor gestiona alumnos, grupos, juegos y recursos para organizar juegos. Para poder ejecutar el Dashboard es necesario tener en marcha el módulo Services (que proporcionará al Dashboard los datos que necesite) y el módulo Server (que gestionará notificaciones y registros de actividad).

## NodeJS

Necesitas instalar NodeJS v10.13.0. Esta instalación incluye la instalación del gestor de paquetes npm.
Para verificar que has instalado la versión correcta:
```
node -v
> v10.13.0
```
## Git y GitHub

Necesitas instalar estas herramientas para gestión de versiones y repositorio en la nube:
 
https://git-scm.com/book/en/v2/Getting-Started-Installing-Git
 
https://github.com/


### Instala native addons en Linux (Ubuntu)

```
sudo apt-get install gcc g++ make
```

### Instala native addons en Windows
Deben instalarse en con permiso de administrador
```
npm install -g windows-build-tools@5.1.0
```

## Cliente angular
Instalar también con permisos de administrador
```
npm install -g @angular/cli@7.0.6
```

## Dependencias locales

Después de clonar el repositorio hay que instalar las dependencias locales
```
npm install
```

## Puesta en marcha

```
npm install
```
A partir de ese momento puede accederse al Dashboard conectandose a http://localhost:4200

IMPORTANTE: Para poner en marcha el Dashboard es necesario tener en marcha el módulo Services y el módulo Server.
