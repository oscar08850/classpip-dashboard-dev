# Classpip Administration Dashboard
[![Classpip Badge](https://img.shields.io/badge/classpip-dashboard-brightgreen.svg)](https://github.com/rocmeseguer/classpip-dashboard)
[![Classpip Badge](https://img.shields.io/badge/classpip-mobile-brightgreen.svg)](https://github.com/rocmeseguer/classpip-mobile)
[![Classpip Badge](https://img.shields.io/badge/classpip-services-brightgreen.svg)](https://github.com/rocmeseguer/classpip-services)
[![license](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](https://github.com/classpip/classpip/blob/master/LICENSE)

Classpip is a software architecture for teachers and students to perform school gamification activities inside the school environment through different platforms such as mobiles, tablets and computers.

The software architecture is composed by two mobile applications for performing “quick” class activities oriented to teachers and students. For “long” operations such as deep into reports and setup the platform there is an administration dashboard accessible from every computer. These three pieces share the information through a service-oriented architecture that exposes the main methods for data manipulation.

![classpip-arch](https://github.com/classpip/classpip/raw/master/images/project-architecture.png)

# Dashboard

This repository contains the main dashboard panel administration for the classpip project. With this admin panel you could manage all the classpip opertations and data for the website. The project is created using [angular CLI](https://github.com/angular/angular-cli) and some operations are related to this client.

## NodeJS

You need to install NodeJS v10.13.0. This will install also npm (Node Package Manager). 
Check that you have the correc NodeJS version:
```
node -v
> v10.13.0
```
## Git and GitHub

You need to install Git and have an account in GitHub:
 
https://git-scm.com/book/en/v2/Getting-Started-Installing-Git
 
https://github.com/


### To build native addons on Linux (Ubuntu)

```
sudo apt-get install gcc g++ make
```

### To build native addons on Windows

```
npm install -g windows-build-tools@~5.1.0
```

## Global dependencies

```
npm install -g @angular/cli@~7.0.6
```

## Local dependencies

After cloning this repository you must install the local dependencies:
```
npm install
```

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).


## License

Classpip is released under the [Apache2 License](https://github.com/classpip/classpip-mobile/blob/master/LICENSE).
