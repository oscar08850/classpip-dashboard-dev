# Classpip Administration Dashboard
[![Classpip Badge](https://img.shields.io/badge/classpip-dashboard-brightgreen.svg)](https://github.com/rocmeseguer/classpip-dashboard)
[![Classpip Badge](https://img.shields.io/badge/classpip-mobile-brightgreen.svg)](https://github.com/rocmeseguer/classpip-mobile)
[![Classpip Badge](https://img.shields.io/badge/classpip-services-brightgreen.svg)](https://github.com/rocmeseguer/classpip-services)
[![license](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](https://github.com/classpip/classpip/blob/master/LICENSE)

Classpip is a software architecture for teachers and students to perform school gamification activities inside the school environment through different platforms such as mobiles, tablets and computers.

The software architecture is composed by a mobile application for performing “quick” class activities oriented to teachers and students. For “long” operations such as deep into reports and setup the platform there is an administration dashboard accessible from every computer. These two pieces shares the information through a service-oriented architecture that exposes the main methods for data manipulation.

![classpip-arch](https://github.com/classpip/classpip/raw/master/images/project-architecture.png)

# Dashboard

This repository contains the main dashboard panel administration for the classpip project. With this admin panel you could manage all the classpip opertations and data for the website. The project is created using [angular CLI](https://github.com/angular/angular-cli) and some operations are related to this client.

[Angular CLI](https://github.com/angular/angular-cli) version 7.0.6

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

## Global dependencies

Make sure you have NodeJS installed. Download the installer [here](https://nodejs.org/dist/latest-v8.x/) or use your favorite package manager. It's best to get the 8x version of node along with the 5x version of npm. This offers the best in stability and speed for building.

```
node -v
> v10.13.0
```

## Local dependencies

All the project dependencies are manage through [npmjs](https://www.npmjs.com/). This command will also download the typings configured in the **typings.json** file. To install this dependencies you should run:

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
