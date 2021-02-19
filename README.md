# Classpip Dashboard

## ¿Qué es Classpip?

[![Classpip Badge](https://img.shields.io/badge/classpip-dashboard-brightgreen.svg)](https://github.com/classpip/classpip-dashboard-dev)
[![Classpip Badge](https://img.shields.io/badge/classpip-movil--profesor-brightgreen)](https://github.com/classpip/classpip-movil-profesor-dev)
[![Classpip Badge](https://img.shields.io/badge/classpip-movil--estudiante-brightgreen)](https://github.com/classpip/classpip-movil-estudiante-dev)
[![Classpip Badge](https://img.shields.io/badge/classpip-server-brightgreen.svg)](https://github.com/classpip/classpip-server-dev)
[![Classpip Badge](https://img.shields.io/badge/classpip-API-brightgreen)](https://github.com/classpip/classpip-API-dev)
[![license](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](https://github.com/classpip/classpip/blob/master/LICENSE)


Classpip es una herramienta para introducir gamificación en el aula. La gamificación consiste en la introducción de las mecánicas típicas de los juegos en escenarios que no son juegos, para motivar a las personas a hacer cosas que quizá no tienen muchas ganas de hacer.

![classpip-arch](https://github.com/classpip/classpip/raw/master/images/project-architecture.png)

En la actualidad Classpip se compone de 5 aplicaciones. A continuación se describen esas aplicaciones y se proporcionan los enlaces a las versiones en desarrollo de cada una de ellas.
 
* *Classpip-dashboard*: Es la aplicación web con la que, desde su ordenador, el profesor puede tomar todas las decisiones sobre configuración de los juegos (por ejemplo, crear una colección nueva) e interacción con cada juego (por ejemplo, asignar puntos a los alumnos). 
[![Classpip Badge](https://img.shields.io/badge/classpip-dashboard-brightgreen.svg)](https://github.com/classpip/classpip-dashboard-dev)

* *Classpip-movil-profesor*: Es la aplicación mediante la cual el profesor puede hacer algunas funciones que resulta apropiado hacer desde un dispositivo móvil (por ejemplo, asignar cromos a alumnos concretos o consultar el ranking del juego de puntos).
[![Classpip Badge](https://img.shields.io/badge/classpip-movil--profesor-brightgreen)](https://github.com/classpip/classpip-movil-profesor-dev)

* *Classpip-movil-estudiante*: Es la aplicación mediante la cual el alumno interacciona con el juego (por ejemplo, consulta los puntos que tiene, intercambia cromos con los compañeros o responde a las preguntas de un juego de preguntas). 
[![Classpip Badge](https://img.shields.io/badge/classpip-movil--estudiante-brightgreen)](https://github.com/classpip/classpip-movil-estudiante-dev)
  
* *Classpip-API*: Es la aplicación que ofrece al resto de aplicaciones los servicios de acceso a datos en modo API-REST  (por ejemplo, obtener la lista de juegos de un grupo, o los cromos que tiene un alumno en su álbum).
[![Classpip Badge](https://img.shields.io/badge/classpip-API-brightgreen)](https://github.com/classpip/classpip-API-dev)
 
 * *Classpip-server*: Es la aplicación que realiza tareas de notificación entre los usuarios. Por ejemplo, recibe la notificación de que un alumno ha completado un cuestionario y remite esa notificación al Dash para que refleje esa circunstancia en el listado de alumnos que participan en el juego. También realiza tareas de registro de actividad (por ejemplo, registrar la creación de grupos o de juegos).
[![Classpip Badge](https://img.shields.io/badge/classpip-server-brightgreen.svg)](https://github.com/classpip/classpip-server-dev)


## Dashboard

Este repositorio contiene el código de la aplicación Classpip-dashboard (versión en desarrollo), que es el cuadro de mandos desde el que el profesor gestiona alumnos, grupos, juegos y recursos para organizar juegos. Para poder ejecutar el Dashboard es necesario tener en marcha la aplicación Classpip-API (que proporcionará al Dashboard los datos que necesite) y la aplicación Classpip-server (que gestionará notificaciones y registros de actividad).

### NodeJS

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

Además tienes que crear una cuenta en GitHub (si no la tienes aún) en la que harás el fork de la aplicación, para poder hacer contribuciones en ella.
 
 
### Native addons en Linux (Ubuntu)

```
sudo apt-get install gcc g++ make
```

### Native addons en Windows
Deben instalarse en con permiso de administrador
```
npm install -g windows-build-tools@5.1.0
```

### Cliente angular
Instalar también con permisos de administrador
```
npm install -g @angular/cli@7.0.6
```
### Instalación de la aplicación

Para instalar la aplicación y organizar la información para futuras contribuciones hay que seguir los pasos del 1 al 6 del protocolo de instalación y contríbuciones que se encuentra aquí: https://github.com/classpip/classpip..


### Puesta en marcha

```
ng serve
```
A partir de ese momento puede accederse al Dashboard conectandose a http://localhost:4200

IMPORTANTE: Para poner en marcha Classpip-dashboard es necesario tener en marcha Classpip-server y Classpip-API.
