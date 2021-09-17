import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

import { Alumno, Profesor, Punto, Equipo, Nivel, Grupo } from 'src/app/clases';
import { PeticionesAPIService, CalculosService, SesionService } from 'src/app/servicios/index';

@Component({
  selector: 'app-actividad-graficos',
  templateUrl: './actividad-graficos.component.html',
  styleUrls: ['./actividad-graficos.component.scss']
})
export class ActividadGraficosComponent implements OnInit {

  //Variables para los Gráficos
  histograma: any;
  tipoHistograma: number;
  diaInicialHistograma: Date;
  diaFinalHistograma: Date;
  cargandoHistograma: boolean; //Variable para mostrar el icono de carga (Progress Spinner)

  /* funcion: any;
  tipoFuncion: number;
  diaInicialFuncion: Date;
  diaFinalFuncion: Date; */

  diagrama: any;
  tipoDiagrama: number;
  diaInicialDiagrama: Date;
  diaFinalDiagrama: Date;
  cargandoDiagrama: boolean; //Variable para mostrar el icono de carga (Progress Spinner)

  grafo: any;
  tipoGrafo: number;
  cargandoGrafo: boolean; //Variable para mostrar el icono de carga (Progress Spinner)

  //Datos
  listaAlumnos: Alumno[];
  listaAlumnosConTodos: Alumno[]; //Lista de Alumnos que incluye la opción "Filtrar por TODOS LOS ALUMNOS"
  alumnoSeleccionado: Alumno; //Alumno del cual se van a mostrar los gráficos
  listaEquipos: Equipo[];
  listaEquiposConTodos: Equipo[]; //Lista de Equipos que incluye la opción "Filtrar por TODOS LOS EQUIPOS"
  equipoSeleccionado: Equipo; //Equipo del cual se van a mostrar los gráficos
  listaGrupos: Grupo[];
  grupoSeleccionado: Grupo; //Grupo del cual se van a mostrar los Equipos y Juegos para filtrar
  tipoJuegoSelecionado: string;
  listaJuegos: any[];
  juegoSeleccionado: any; //Juego del cual se van a mostrar los gráficos
  listaPuntos: Punto[];
  puntoSeleccionado: Punto; //Tipo de Punto por el cual se va a mostrar el gráfico
  listaNiveles: Nivel[]; 
  nivelSeleccionado: Nivel; //Nivel obtenido por el cual se va a mostrar el gráfico
  alumnoReceptorCromoSeleccionado: Alumno; //Alumno (por el cual se va a mostrar el gráfico) al cual le han regalado un Cromo
  equipoReceptorCromoSeleccionado: Equipo; //Equipo (por el cual se va a mostrar el gráfico) al cual le han regalado un Cromo
  privilegioSeleccionado: number; //Privilegio del cual se va a mostrar el gráfico

  constructor(
    private APIService: PeticionesAPIService,
    private calculosService: CalculosService,
    private sesionService: SesionService
  ) {
    this.tipoHistograma = 0;
    //this.tipoFuncion = 0;
    this.tipoDiagrama = 0;
    this.tipoGrafo = 0;
    this.cargandoHistograma = false;
    this.cargandoDiagrama = false;
    this.cargandoGrafo = false;
    this.listaAlumnos = [];
    this.listaAlumnosConTodos = [];
    this.alumnoSeleccionado = new Alumno();
    this.listaEquipos = [];
    this.listaEquiposConTodos = [];
    this.equipoSeleccionado = new Equipo();
    this.listaGrupos = [];
    this.grupoSeleccionado = new Grupo();
    this.tipoJuegoSelecionado = " ";
    this.listaJuegos = [];
    this.juegoSeleccionado = {};
    this.listaPuntos = [];
    this.puntoSeleccionado = new Punto();
    this.listaNiveles = [];
    this.nivelSeleccionado = new Nivel();
    this.alumnoReceptorCromoSeleccionado = new Alumno();
    this.equipoReceptorCromoSeleccionado = new Equipo();
    this.privilegioSeleccionado = 0;
  }

  ngOnInit() {
    let profesor: Profesor = this.sesionService.DameProfesor();

    this.APIService.DameTodosMisAlumnos(profesor.id).subscribe((alumnos) => {
      //console.log(alumnos);

      //Creamos y añadimos un "Alumno falso" a la lista de Alumnos con TODOS, para poder filtrar por todos los alumnos
      this.listaAlumnosConTodos.push(new Alumno(" [TODOS", "LOS", "ALUMNOS] ", "todos", undefined, " ", undefined, undefined));
      this.listaAlumnosConTodos[0].id = -1;

      alumnos.forEach((alumno) => {
        this.listaAlumnos.push(alumno);
        this.listaAlumnosConTodos.push(alumno);
      });

      this.APIService.DameGruposProfesor(profesor.id).subscribe((grupos) => {
        //console.log(grupos);
        this.listaGrupos = grupos;
      }, (err) => {
        console.log(err);
        Swal.fire({
          title: "Error al obtener los Grupos para el filtro del Gráfico",
          text: err.message,
          icon: "error",
          showConfirmButton: false,
          timer: 3000
        });
      });
    }, (err) => {
      console.log(err);
      Swal.fire({
        title: "Error al obtener los Alumnos para el filtro del Gráfico",
        text: err.message,
        icon: "error",
        showConfirmButton: false,
        timer: 3000
      });
    });
  }

  grupoCambiado(event: any){
    //console.log(event);
    if(event.value != null){
      //Reiniciamos las Listas y Selectores
      this.listaEquipos = [];
      this.listaJuegos = [];
      this.listaPuntos = [];
      this.listaNiveles = [];
      this.equipoSeleccionado = new Equipo();
      this.equipoReceptorCromoSeleccionado = new Equipo();
      this.juegoSeleccionado = {};
      this.tipoJuegoSelecionado = " ";
      this.puntoSeleccionado = new Punto();
      this.nivelSeleccionado = new Nivel();

      this.APIService.DameEquiposDelGrupo(this.grupoSeleccionado.id).subscribe((equipos) => {
        //console.log(equipos);

        //Creamos y añadimos un "Equipo falso" a la lista de Equipos con TODOS, para poder filtrar por todos los equipos
        this.listaEquiposConTodos.push(new Equipo(" [TODOS LOS EQUIPOS] ", undefined));
        this.listaEquiposConTodos[0].id = -1;

        equipos.forEach((equipo) => {
          if(!this.listaEquipos.includes(equipo)){
            this.listaEquipos.push(equipo);
          }
          if(!this.listaEquiposConTodos.includes(equipo)){
            this.listaEquiposConTodos.push(equipo);
          }
        });
      }, (err) => {
        console.log(err);
        Swal.fire({
          title: "Error al obtener los Equipos para el filtro del Gráfico",
          text: err.message,
          icon: "error",
          showConfirmButton: false,
          timer: 3000
        });
      });
    }
  }

  tipoJuegoCambiado(event: any){
    //console.log(event);
    if((this.grupoSeleccionado.id != null) && (event.value != null)){
      //Reiniciamos las Listas y Selectores
      this.listaJuegos = [];
      this.juegoSeleccionado = {};

      this.calculosService.DameJuegosDelGrupoSegunTipo(this.tipoJuegoSelecionado, this.grupoSeleccionado.id).subscribe((juegos) => {
        //console.log(juegos);
        this.listaJuegos = juegos;
      }, (err) => {
        console.log(err);
        Swal.fire({
          title: "Error al obtener los Juegos para el filtro del Gráfico",
          text: err.message,
          icon: "error",
          showConfirmButton: false,
          timer: 3000
        });
      });
    }
  }

  juegoCambiado(event: any){
    //console.log(event);
    if((this.grupoSeleccionado.id != null) && (event.value != null)){
      //Reiniciamos las Listas y Selectores
      this.listaPuntos = [];
      this.listaNiveles = [];
      this.puntoSeleccionado = new Punto();
      this.nivelSeleccionado = new Nivel();
      
      if(this.tipoHistograma != 0){
        switch (Number(this.tipoHistograma)) {
          case 10: //Número de Puntos obtenidos por un Alumno/Equipo [JUEGO DE PUNTOS]
          case 11: //Número de Alumnos/Equipos que han obtenido el Tipo de Punto [JUEGO DE PUNTOS]
            this.APIService.DamePuntosJuegoDePuntos(this.juegoSeleccionado.id).subscribe((puntos) => {
              //console.log(puntos);
              puntos.forEach((punto) => {
                if(!this.listaPuntos.includes(punto)) {
                  this.listaPuntos.push(punto);
                }
              });

              //Creamos un "Punto falso" para poder filtrar por todos los Tipos de Puntos
              this.listaPuntos.unshift(new Punto(" [TODOS LOS TIPOS DE PUNTO] ", " "));
              this.listaPuntos[0].id = -1;
            }, (err) => {
              console.log(err);
              Swal.fire({
                title: "Error al obtener los Puntos para el filtro del Gráfico",
                text: err.message,
                icon: "error",
                showConfirmButton: false,
                timer: 3000
              });
            });
            break;

          default: 
            break;
        }
      }

      if(this.tipoDiagrama != 0){
        switch (Number(this.tipoDiagrama)) {
          case 10: //Diagrama Punch Card de los Ascensos de Nivel de un Alumno/Equipo (Juego de Puntos) [JUEGO DE PUNTOS]
            this.listaNiveles = [];
            this.APIService.DameNivelesJuegoDePuntos(this.juegoSeleccionado.id).subscribe((niveles) => {
              //console.log(niveles);
              niveles.forEach((nivel) => {
                if(!this.listaNiveles.includes(nivel)) {
                  this.listaNiveles.push(nivel);
                }
              });

              //Creamos un "Nivel falso" para poder filtrar por todos los Niveles
              this.listaNiveles.unshift(new Nivel(" [TODOS LOS NIVELES] ", undefined, undefined, undefined, undefined));
              this.listaNiveles[0].id = -1;
            }, (err) => {
              console.log(err);
              Swal.fire({
                title: "Error al obtener los Niveles para el filtro del Gráfico",
                text: err.message,
                icon: "error",
                showConfirmButton: false,
                timer: 3000
              });
            });
            break;

          default:
            break;
        }
      }
    }
  }

  async DameHistograma() {
    this.cargandoHistograma = true;
    //                                                                                                   ↓ Poner todos los tipos de histograma que impliquen SÓLO a un Alumno
    if ((this.tipoHistograma == 0) || (this.juegoSeleccionado.id == null) || ((this.tipoHistograma == 1 || this.tipoHistograma == 30) && this.alumnoSeleccionado.id == null) || ((this.tipoHistograma == 10 || this.tipoHistograma == 11) && this.puntoSeleccionado.id == null) || (this.tipoHistograma == 12 && this.nivelSeleccionado.id == null) || (this.diaInicialHistograma == null) || (this.diaFinalHistograma == null)) {
      Swal.fire({
        title: "Cuidado",
        text: "Falta rellenar algún dato",
        icon: "warning",
      });
    }
    //                                                               ↓ Poner todos los tipos de histograma que impliquen a un(os) Alumno(s) O a un(OS) Equipo(s)
    else if ((this.tipoHistograma == 10 || this.tipoHistograma == 12 || this.tipoHistograma == 20) && (((this.juegoSeleccionado.Modo == "Individual") && (this.alumnoSeleccionado.id == null)) || ((this.juegoSeleccionado.Modo == 'Equipos') && (this.equipoSeleccionado.id == null)))){
      Swal.fire({
        title: "Cuidado",
        text: "Selecciona un Alumno o un Equipo",
        icon: "warning",
      });
    }
    else if ((this.tipoHistograma == 21) && ((this.juegoSeleccionado.Modo == "Individual" && (this.alumnoSeleccionado.id == null || this.alumnoReceptorCromoSeleccionado.id == null)) || (this.juegoSeleccionado.Modo == 'Equipos' && (this.equipoSeleccionado.id == null  || this.equipoReceptorCromoSeleccionado.id == null)))){
      Swal.fire({
        title: "Cuidado",
        text: "Selecciona a los Alumnos/Equipos Emisor y Receptor del Cromo regalado",
        icon: "warning",
      });
    }
    else if (this.tipoHistograma == 21 && (((this.alumnoSeleccionado == this.alumnoReceptorCromoSeleccionado) && ((this.alumnoSeleccionado.id != -1) && (this.alumnoReceptorCromoSeleccionado.id != -1))) || (this.equipoSeleccionado == this.equipoReceptorCromoSeleccionado && ((this.equipoSeleccionado.id != -1) && (this.equipoReceptorCromoSeleccionado.id != -1))))){
      Swal.fire({
        title: "Cuidado",
        text: "No puedes seleccionar al mismo Alumno o Equipo en ambas opciones",
        icon: "warning",
      });
    }
    else if (this.diaInicialHistograma > this.diaFinalHistograma) {
      Swal.fire({
        title: "Cuidado",
        text: "Los días inicial y final han de estar en orden",
        icon: "warning",
      });
    }
    else {
      let profesor: Profesor = this.sesionService.DameProfesor();
      this.calculosService.CalculaHistograma(this.tipoHistograma, this.diaInicialHistograma, this.diaFinalHistograma, this.juegoSeleccionado, profesor, this.alumnoSeleccionado, this.equipoSeleccionado, this.puntoSeleccionado, this.nivelSeleccionado, this.alumnoReceptorCromoSeleccionado, this.equipoReceptorCromoSeleccionado).subscribe((histograma) => {      
        //console.log(histograma);

        this.cargandoHistograma = false;
        this.histograma = histograma;
      }, (err) => {
        console.log(err);
        Swal.fire({
          title: "Error al obtener los Datos para mostrar el Histograma",
          text: err.message,
          icon: "error",
          showConfirmButton: false,
          timer: 3000
        });
        this.cargandoHistograma = false;
      });
    }
  }

  GenerarPDFHistograma() {
    //De momento no funciona pasar los gráficos a un PDF
    if(true) {
      Swal.fire({
        title: "No disponible",
        text: "Todavía no está disponible la función descargar Histograma en PDF",
        icon: "error",
      });
    }
    else {
      this.cargandoHistograma = true;
      if (this.histograma != null) {
        const doc: jsPDF = new jsPDF();

        //Márgenes
        let margenSup: number = 20;
        let margenIzq: number = 15;

        //Título
        doc.setFont("times", "bold");
        doc.setFontSize(30);
        doc.setTextColor(63, 81, 181);

        doc.text("Gráfico de Actividad: Histograma", margenIzq, margenSup);
        doc.line(margenIzq, margenSup + 5, margenIzq + 150, margenSup + 5);

        //Subtítulos
        doc.setFont("helvetica", "normal");
        doc.setFontSize(14);
        doc.setTextColor("black");

        let profesor: Profesor = this.sesionService.DameProfesor();
        let datosProfesor: string = doc.splitTextToSize(`Profesor: ${profesor.Nombre} ${profesor.PrimerApellido} ${profesor.SegundoApellido} (${profesor.email})`, 180);
        doc.text(datosProfesor, margenIzq, margenSup + 15);

        let l1: string = " ";
        let l2: string = " ";
        let l3: string = " ";
        let l4: string = " ";

        let fecha: Date = new Date();
        let dia = ('0' + fecha.getDate()).slice(-2);
        let mes = ('0' + (fecha.getMonth() + 1)).slice(-2);
        let anyo = fecha.getFullYear();
        let hora = ('0' + fecha.getHours()).slice(-2);
        let minutos = ('0' + fecha.getMinutes()).slice(-2);
        let datosFecha: string = doc.splitTextToSize(`Fecha y hora de generación: ${dia}/${mes}/${anyo}  ${hora}:${minutos}`, 180);

        switch (Number(this.tipoHistograma)) {
          case 1: //Juego+Alumno
            l1 = doc.splitTextToSize("Tipo de Histograma: Número de accesos a un Juego del Alumno", 180);
            l2 = doc.splitTextToSize(`Juego seleccionado: ${this.juegoSeleccionado.NombreJuego}`, 180);
            l3 = doc.splitTextToSize(`Alumno seleccionado: ${this.alumnoSeleccionado.Nombre} ${this.alumnoSeleccionado.PrimerApellido} ${this.alumnoSeleccionado.SegundoApellido} (${this.alumnoSeleccionado.Email})`, 180);
            l4 = doc.splitTextToSize(" ", 180);
            break;

          case 2: //Juego
            l1 = doc.splitTextToSize("Tipo de Histograma: Número de Alumnos que han accedido a un Juego", 180);
            l2 = doc.splitTextToSize(`Juego seleccionado: ${this.juegoSeleccionado.NombreJuego}`, 180);
            l3 = doc.splitTextToSize(" ", 180);
            l4 = doc.splitTextToSize(" ", 180);
            break;

          case 10: //Juego+Alumno/Equipo+Punto
            l1 = doc.splitTextToSize("Tipo de Histograma: Número de Puntos obtenidos por un Alumno/Equipo en un Juego de Puntos", 180);
            l2 = doc.splitTextToSize(`Juego seleccionado: ${this.juegoSeleccionado.NombreJuego}`, 180);
            if (this.juegoSeleccionado.Modo == 'Individual') { //Juego de Puntos Individual
              l3 = doc.splitTextToSize(`Alumno seleccionado: ${this.alumnoSeleccionado.Nombre} ${this.alumnoSeleccionado.PrimerApellido} ${this.alumnoSeleccionado.SegundoApellido} (${this.alumnoSeleccionado.Email})`, 180);
            }
            else { //Juego de Puntos en Equipos
              l3 = doc.splitTextToSize(`Equipo seleccionado: ${this.equipoSeleccionado.Nombre}`, 180);
            }
            l4 = doc.splitTextToSize(`Punto (Tipo) seleccionado: ${this.puntoSeleccionado.Nombre}`, 180);
            break;

          case 11: //Juego+Punto
            l1 = doc.splitTextToSize("Tipo de Histograma: Número de Alumnos/Equipos que han conseguido el Tipo de Punto en un Juego de Puntos", 180);
            l2 = doc.splitTextToSize(`Juego seleccionado: ${this.juegoSeleccionado.NombreJuego}`, 180);
            l3 = doc.splitTextToSize(`Punto (Tipo) seleccionado: ${this.puntoSeleccionado.Nombre}`, 180);
            l4 = doc.splitTextToSize(" ", 180);
            break;

          case 20: //Juego+Alumno/Equipo
            l1 = doc.splitTextToSize("Tipo de Histograma: Número de Cromos obtenidos por un Alumno/Equipo en un Juego de Colección", 180);
            l2 = doc.splitTextToSize(`Juego seleccionado: ${this.juegoSeleccionado.NombreJuego}`, 180);
            if (this.juegoSeleccionado.Modo == 'Individual') { //Juego de Colección Individual
              l3 = doc.splitTextToSize(`Alumno seleccionado: ${this.alumnoSeleccionado.Nombre} ${this.alumnoSeleccionado.PrimerApellido} ${this.alumnoSeleccionado.SegundoApellido} (${this.alumnoSeleccionado.Email})`, 180);
            }
            else { //Juego de Colección en Equipos
              l3 = doc.splitTextToSize(`Equipo seleccionado: ${this.equipoSeleccionado.Nombre}`, 180);
            }
            l4 = doc.splitTextToSize(" ", 180);
            break;

          case 21: //Juego+Alumno/Equipo+AlumnoReceptorCromo/EquipoReceptorCromo
            l1 = doc.splitTextToSize("Tipo de Histograma: Número de Cromos regalados por un Alumno/Equipo a un Alumno/Equipo en un Juego de Colección", 180);
            l2 = doc.splitTextToSize(`Juego seleccionado: ${this.juegoSeleccionado.NombreJuego}`, 180);
            if (this.juegoSeleccionado.Modo == 'Individual') { //Juego de Colección Individual
              l3 = doc.splitTextToSize(`Alumno seleccionado: ${this.alumnoSeleccionado.Nombre} ${this.alumnoSeleccionado.PrimerApellido} ${this.alumnoSeleccionado.SegundoApellido} (${this.alumnoSeleccionado.Email})`, 180);
              l4 = doc.splitTextToSize(`Alumno Receptor de Cromo seleccionado: ${this.alumnoReceptorCromoSeleccionado.Nombre} ${this.alumnoReceptorCromoSeleccionado.PrimerApellido} ${this.alumnoReceptorCromoSeleccionado.SegundoApellido} (${this.alumnoReceptorCromoSeleccionado.Email})`, 180);
            }
            else { //Juego de Colección en Equipos
              l3 = doc.splitTextToSize(`Equipo seleccionado: ${this.equipoSeleccionado.Nombre}`, 180);
              l4 = doc.splitTextToSize(`Equipo Receptor de Cromo seleccionado: ${this.equipoReceptorCromoSeleccionado.Nombre}`, 180);
            }
            break;

          case 30: //Juego+Alumno
            l1 = doc.splitTextToSize("Tipo de Histograma: Número de modificaciones de Avatar de un Alumno en un Juego de Avatar", 180);
            l2 = doc.splitTextToSize(`Juego seleccionado: ${this.juegoSeleccionado.NombreJuego}`, 180);
            l3 = doc.splitTextToSize(`Alumno seleccionado: ${this.alumnoSeleccionado.Nombre} ${this.alumnoSeleccionado.PrimerApellido} ${this.alumnoSeleccionado.SegundoApellido} (${this.alumnoSeleccionado.Email})`, 180);
            l4 = doc.splitTextToSize(" ", 180);
            break;

          default:
            break;
        }

        doc.text(l1, margenIzq, margenSup + 25);
        doc.text(l2, margenIzq, margenSup + 35);
        doc.text(l3, margenIzq, margenSup + 45);
        doc.text(l4, margenIzq, margenSup + 55);
        doc.text(datosFecha, margenIzq, margenSup + 68);

        //Generar la imagen con el Histograma                                   //NO FUNCIONA DE MOMENTO
        html2canvas(document.querySelector('#histograma')).then(canvas => {
          let imgData: string = canvas.toDataURL('image/jpeg', 1);

          //Insertar la imagen en el documento PDF
          doc.addImage(imgData, 'JPEG', margenIzq, margenSup + 75, 400, 100);
        });

        //Nombre del fichero y Guardado
        let filename: string = `GraficoActividadClasspip_${dia}-${mes}-${anyo}_${hora}-${minutos}.pdf`;
        doc.save(filename);

        this.cargandoHistograma = false;
      }
      else {
        this.cargandoHistograma = false;
        Swal.fire({
          title: "Cuidado",
          text: "Aún no has generado el Histograma",
          icon: "warning",
        });
      }
    }
  }

/*   async DameFuncion() {
    if ((this.tipoFuncion == 0) || (this.nombreJuegoSeleccionado == " ") || (this.diaInicialFuncion == null) || (this.diaFinalFuncion == null)) {
      Swal.fire({
        title: "Cuidado",
        text: "Falta rellenar algún dato",
        icon: "warning",
      });
    }
    //                            ↓ Poner todos los tipos de función que impliquen a un Alumno/Equipo
    else if((this.tipoFuncion == 1) && (((this.alumnoSeleccionado.id == undefined) && (this.equipoSeleccionado.id == undefined)) || ((this.alumnoSeleccionado.id != undefined) && (this.equipoSeleccionado.id != undefined)))){
      Swal.fire({
        title: "Cuidado",
        text: "Selecciona un Alumno o un Equipo",
        icon: "warning",
      });
    }
    else if (this.diaInicialFuncion > this.diaFinalFuncion) {
      Swal.fire({
        title: "Cuidado",
        text: "Los días inicial y final han de estar en orden",
        icon: "warning",
      });
    }
    else {
      let profesor: Profesor = this.sesionService.DameProfesor();
      this.calculosService.CalculaFuncion(this.tipoHistograma, this.diaInicial, this.diaFinal, this.juegoSeleccionado, profesor, this.alumnoSeleccionado, this.equipoSeleccionado).subscribe((datos) => {
        //console.log(datos);

        this.funcion = {
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'pointer',
            }
          },
          legend: {
            data: ['Puntos obtenidos', 'Puntos totales', 'Nivel']
          },
          xAxis: [
            {
              type: 'category',
              data: ['1 Jun', '2 Jun', '3 Jun', '4 Jun', '5 Jun', '6 Jun', '7 Jun', '8 Jun', '9 Jun', '10 Jun', '11 Jun', '12 Jun'],
              axisPointer: {
                type: 'shadow'
              }
            }
          ],
          yAxis: [
            {
              type: 'value',
              name: 'Puntos',
              interval: 1,
              axisLabel: {
                formatter: '{value} puntos'
              }
            },
            {
              type: 'category',
              name: 'Nivel',
              interval: 1,
              axisLabel: {
                formatter: 'Nivel {value}'
              }
            }
          ],
          series: [
            {
              name: 'Puntos obtenidos',
              type: 'bar',
              data: [1, 0, 0, 2, 0, 1, 0, 0, 2, 0, 2, 2]
            },
            {
              name: 'Puntos totales',
              type: 'bar',
              data: [1, 1, 1, 3, 3, 4, 4, 4, { value: 6, itemStyle: {color: 'green'}}, 6, 8, { value: 10, itemStyle: {color: 'green'}}]
            },
            {
              name: 'Nivel',
              type: 'line',
              yAxisIndex: 1,
              data: ["Sin nivel (0p)", "Sin nivel (0p)", "Sin nivel (0p)", "Sin nivel (0p)", "Sin nivel (0p)", "Sin nivel (0p)", "Sin nivel (0p)", "Sin nivel (0p)", "Nivel 1 (5p)", "Nivel 1 (5p)", "Nivel 1 (5p)", "Nivel 2 (10p)"]
            }
          ]
        };
      }, (err) => {
        console.log(err);
        Swal.fire({
          title: "Error al obtener los Datos para mostrar la Funcion",
          text: err.message,
          icon: "error",
          showConfirmButton: false,
          timer: 3000
        });
      });
    }
  } */

  /* GenerarPDFFuncion() {
    if (this.funcion != null) {
      const doc: jsPDF = new jsPDF();

      //Márgenes
      let margenSup: number = 20;
      let margenIzq: number = 15;

      //Título
      doc.setFont("times", "bold");
      doc.setFontSize(30);
      doc.setTextColor(63, 81, 181);

      doc.text("Gráfico de Actividad: Función Contínua", margenIzq, margenSup);
      doc.line(margenIzq, margenSup + 5, margenIzq + 150, margenSup + 5);

      //Subtítulos
      doc.setFont("helvetica", "normal");
      doc.setFontSize(14);
      doc.setTextColor("black");

      let l1: string = " ";
      let l2: string = " ";
      let l3: string = " ";

      let fecha: Date = new Date();
      let dia = ('0' + fecha.getDate()).slice(-2);
      let mes = ('0' + (fecha.getMonth() + 1)).slice(-2);
      let anyo = fecha.getFullYear();
      let hora = ('0' + fecha.getHours()).slice(-2);
      let minutos = ('0' + fecha.getMinutes()).slice(-2);
      let datosFecha: string = doc.splitTextToSize(`Fecha y hora de generación: ${dia}/${mes}/${anyo}  ${hora}:${minutos}`, 180);

      switch (Number(this.tipoFuncion)) {
        case 1:
          l1 = doc.splitTextToSize("Tipo de Función: Evolución del Nivel de un Juego de Puntos", 180);
          l2 = doc.splitTextToSize(`Juego seleccionado: ${this.nombreJuegoSeleccionado}`, 180);
          l3 = doc.splitTextToSize(`Alumno seleccionado: ${this.alumnoSeleccionado.Nombre} ${this.alumnoSeleccionado.PrimerApellido} ${this.alumnoSeleccionado.SegundoApellido} (${this.alumnoSeleccionado.Email})`, 180)
          break;
        default:
          break;
      }

      doc.text(l1, margenIzq, margenSup + 15);
      doc.text(l2, margenIzq, margenSup + 25);
      doc.text(l3, margenIzq, margenSup + 35);
      doc.text(datosFecha, margenIzq, margenSup + 48);

      //Generar la imagen con el Histograma
      html2canvas(document.querySelector('#funcion')).then(canvas => {
        let imgData: string = canvas.toDataURL('image/jpeg', 1);

        //Insertar la imagen en el documento PDF
        doc.addImage(imgData, 'JPEG', margenIzq, margenSup + 55, 400, 100);
      });

      //Nombre del fichero y Guardado
      let filename: string = `GraficoActividadClasspip_${dia}-${mes}-${anyo}_${hora}-${minutos}.pdf`;
      doc.save(filename);
    }
    else {
      Swal.fire({
        title: "Cuidado",
        text: "Aún no has generado la Función",
        icon: "warning",
      });
    }
  } */

  async DameDiagrama() {
    this.cargandoDiagrama = true;
    //                                                                                           ↓ Poner todos los tipos de diagrama que impliquen SÓLO a un Alumno
    if ((this.tipoDiagrama == 0) || (this.juegoSeleccionado.id == null) || ((this.tipoDiagrama == 30) && this.alumnoSeleccionado.id == null) || (this.tipoDiagrama == 10 && this.nivelSeleccionado.id == null) || (this.tipoDiagrama == 30 && this.privilegioSeleccionado == 0) || (this.diaInicialDiagrama == null) || (this.diaFinalDiagrama == null)) {
      Swal.fire({
        title: "Cuidado",
        text: "Falta rellenar algún dato",
        icon: "warning",
      });
    }
    //                                 ↓ Poner todos los tipos de diagrama que impliquen a un(os) Alumno(s) O a un(OS) Equipo(s)
    else if ((this.tipoDiagrama == 10 || this.tipoDiagrama == 20) && (((this.juegoSeleccionado.Modo == 'Individual') && (this.alumnoSeleccionado.id == null)) || ((this.juegoSeleccionado.Modo == 'Equipos') && (this.equipoSeleccionado.id == null)))){
      Swal.fire({
        title: "Cuidado",
        text: "Selecciona un Alumno O un Equipo",
        icon: "warning",
      });
    }
    else if (this.diaInicialDiagrama > this.diaFinalDiagrama) {
      Swal.fire({
        title: "Cuidado",
        text: "Los días inicial y final han de estar en orden",
        icon: "warning",
      });
    }
    else {
      let profesor: Profesor = this.sesionService.DameProfesor();
      this.calculosService.CalculaDiagrama(this.tipoDiagrama, this.diaInicialDiagrama, this.diaFinalDiagrama, this.juegoSeleccionado, profesor, this.alumnoSeleccionado, this.equipoSeleccionado, this.nivelSeleccionado, this.privilegioSeleccionado).subscribe((diagrama) => {
        //console.log(diagrama);

        this.cargandoDiagrama = false;
        this.diagrama = diagrama;
      }, (err) => {
        console.log(err);
        Swal.fire({
          title: "Error al obtener los Datos para mostrar el Diagrama",
          text: err.message,
          icon: "error",
          showConfirmButton: false,
          timer: 3000
        });
        this.cargandoDiagrama = false;
      });
    }
  }

  GenerarPDFDiagrama() {
    //De momento no funciona pasar los gráficos a un PDF
    if(true) {
      Swal.fire({
        title: "No disponible",
        text: "Todavía no está disponible la función descargar Diagrama en PDF",
        icon: "error",
      });
    }
    else {
      this.cargandoDiagrama = true;
      if (this.diagrama != null) {
        const doc: jsPDF = new jsPDF();

        //Márgenes
        let margenSup: number = 20;
        let margenIzq: number = 15;

        //Título
        doc.setFont("times", "bold");
        doc.setFontSize(30);
        doc.setTextColor(63, 81, 181);

        doc.text("Gráfico de Actividad: Diagrama", margenIzq, margenSup);
        doc.line(margenIzq, margenSup + 5, margenIzq + 150, margenSup + 5);

        //Subtítulos
        doc.setFont("helvetica", "normal");
        doc.setFontSize(14);
        doc.setTextColor("black");

        let profesor: Profesor = this.sesionService.DameProfesor();
        let datosProfesor: string = doc.splitTextToSize(`Profesor: ${profesor.Nombre} ${profesor.PrimerApellido} ${profesor.SegundoApellido} (${profesor.email})`, 180);
        doc.text(datosProfesor, margenIzq, margenSup + 15);

        let l1: string = " ";
        let l2: string = " ";
        let l3: string = " ";
        let l4: string = " ";

        let fecha: Date = new Date();
        let dia = ('0' + fecha.getDate()).slice(-2);
        let mes = ('0' + (fecha.getMonth() + 1)).slice(-2);
        let anyo = fecha.getFullYear();
        let hora = ('0' + fecha.getHours()).slice(-2);
        let minutos = ('0' + fecha.getMinutes()).slice(-2);
        let datosFecha: string = doc.splitTextToSize(`Fecha y hora de generación: ${dia}/${mes}/${anyo}  ${hora}:${minutos}`, 180);

        switch (Number(this.tipoDiagrama)) {
          case 10: //Juego+Alumno/Equipo+Nivel
            l1 = doc.splitTextToSize("Tipo de Diagrama: 'Punch Card' de los Ascensos de Nivel de un Alumno/Equipo en un Juego de Puntos", 180);
            l2 = doc.splitTextToSize(`Juego seleccionado: ${this.juegoSeleccionado.NombreJuego}`, 180);
            if (this.juegoSeleccionado.Modo == 'Individual') { //Juego de Puntos Individual
              l3 = doc.splitTextToSize(`Alumno seleccionado: ${this.alumnoSeleccionado.Nombre} ${this.alumnoSeleccionado.PrimerApellido} ${this.alumnoSeleccionado.SegundoApellido} (${this.alumnoSeleccionado.Email})`, 180);
            }
            else { //Juego de Puntos en Equipos
              l3 = doc.splitTextToSize(`Equipo seleccionado: ${this.equipoSeleccionado.Nombre}`, 180);
            }
            l4 = doc.splitTextToSize(`Nivel seleccionado: ${this.nivelSeleccionado.Nombre})`, 180);
            break;

          case 20: //Juego+Alumno/Equipo
            l1 = doc.splitTextToSize("Tipo de Diagrama: 'Punch Card' de las Finalizaciones de Colecciones de Cromos de Alumnos/Equipos en un Juego de Colección", 180);
            l2 = doc.splitTextToSize(`Juego seleccionado: ${this.juegoSeleccionado.NombreJuego}`, 180);
            if (this.juegoSeleccionado.Modo == 'Individual') { //Juego de Colección Individual
              l3 = doc.splitTextToSize(`Alumno seleccionado: ${this.alumnoSeleccionado.Nombre} ${this.alumnoSeleccionado.PrimerApellido} ${this.alumnoSeleccionado.SegundoApellido} (${this.alumnoSeleccionado.Email})`, 180);
            }
            else { //Juego de Colección en Equipos
              l3 = doc.splitTextToSize(`Equipo seleccionado: ${this.equipoSeleccionado.Nombre}`, 180);
            }
            l4 = doc.splitTextToSize(" ", 180);
            break;

          case 30: //Juego+Alumno+Privilegio
            l1 = doc.splitTextToSize("Tipo de Diagrama: 'Punch Card' de las Asignaciones/Eliminaciones de Privilegios de un Alumno en un Juego de Avatar", 180);
            l2 = doc.splitTextToSize(`Juego seleccionado: ${this.juegoSeleccionado.NombreJuego}`, 180);
            l3 = doc.splitTextToSize(`Alumno seleccionado: ${this.alumnoSeleccionado.Nombre} ${this.alumnoSeleccionado.PrimerApellido} ${this.alumnoSeleccionado.SegundoApellido} (${this.alumnoSeleccionado.Email})`, 180);
            let nombrePrivilegio: string = " ";
            if (this.privilegioSeleccionado == 5) { 
              nombrePrivilegio = "Privilegio Nota de Voz"; 
            }
            else if (this.privilegioSeleccionado == 6) {
              nombrePrivilegio = "Privilegio Espiar";
            }
            else {
              nombrePrivilegio = `Privilegio ${this.privilegioSeleccionado}`;
            }
            l4 = doc.splitTextToSize(`Privilegio seleccionado: ${nombrePrivilegio}`, 180);
            break;

          default:
            break;
        }

        doc.text(l1, margenIzq, margenSup + 25);
        doc.text(l2, margenIzq, margenSup + 35);
        doc.text(l3, margenIzq, margenSup + 45);
        doc.text(l4, margenIzq, margenSup + 55);
        doc.text(datosFecha, margenIzq, margenSup + 68);

        //Generar la imagen con el Diagrama                                   //NO FUNCIONA DE MOMENTO
        html2canvas(document.querySelector('#diagrama')).then(canvas => {
          let imgData: string = canvas.toDataURL('image/jpeg', 1);

          //Insertar la imagen en el documento PDF
          doc.addImage(imgData, 'JPEG', margenIzq, margenSup + 75, 400, 100);
        });

        //Nombre del fichero y Guardado
        let filename: string = `GraficoActividadClasspip_${dia}-${mes}-${anyo}_${hora}-${minutos}.pdf`;
        doc.save(filename);

        this.cargandoDiagrama = false;
      }
      else {
        this.cargandoDiagrama = false;
        Swal.fire({
          title: "Cuidado",
          text: "Aún no has generado el Diagrama",
          icon: "warning",
        });
      }
    }
  }

  async DameGrafo() {
    this.cargandoGrafo = true;
    if ((this.tipoGrafo == 0) || (this.juegoSeleccionado.id == null)) {
      Swal.fire({
        title: "Cuidado",
        text: "Falta rellenar algún dato",
        icon: "warning",
      });
    }
    else {
      let profesor: Profesor = this.sesionService.DameProfesor();
      this.calculosService.CalculaGrafo(this.tipoGrafo, this.juegoSeleccionado, profesor).subscribe((grafo) => {
        //console.log(grafo);

        this.cargandoGrafo = false;
        this.grafo = grafo;
      }, (err) => {
        console.log(err);
        Swal.fire({
          title: "Error al obtener los Datos para mostrar el Grafo",
          text: err.message,
          icon: "error",
          showConfirmButton: false,
          timer: 3000
        });
        this.cargandoGrafo = false;
      });
    }
  }

  GenerarPDFGrafo() {
    //De momento no funciona pasar los gráficos a un PDF
    if(true) {
      Swal.fire({
        title: "No disponible",
        text: "Todavía no está disponible la función descargar Grafo en PDF",
        icon: "error",
      });
    }
    else {
      this.cargandoGrafo = true;
      if (this.grafo != null) {
        const doc: jsPDF = new jsPDF();

        //Márgenes
        let margenSup: number = 20;
        let margenIzq: number = 15;

        //Título
        doc.setFont("times", "bold");
        doc.setFontSize(30);
        doc.setTextColor(63, 81, 181);

        doc.text("Gráfico de Actividad: Grafo", margenIzq, margenSup);
        doc.line(margenIzq, margenSup + 5, margenIzq + 150, margenSup + 5);

        //Subtítulos
        doc.setFont("helvetica", "normal");
        doc.setFontSize(14);
        doc.setTextColor("black");

        let profesor: Profesor = this.sesionService.DameProfesor();
        let datosProfesor: string = doc.splitTextToSize(`Profesor: ${profesor.Nombre} ${profesor.PrimerApellido} ${profesor.SegundoApellido} (${profesor.email})`, 180);
        doc.text(datosProfesor, margenIzq, margenSup + 15);

        let l1: string = " ";
        let l2: string = " ";

        let fecha: Date = new Date();
        let dia = ('0' + fecha.getDate()).slice(-2);
        let mes = ('0' + (fecha.getMonth() + 1)).slice(-2);
        let anyo = fecha.getFullYear();
        let hora = ('0' + fecha.getHours()).slice(-2);
        let minutos = ('0' + fecha.getMinutes()).slice(-2);
        let datosFecha: string = doc.splitTextToSize(`Fecha y hora de generación: ${dia}/${mes}/${anyo}  ${hora}:${minutos}`, 180);

        switch (Number(this.tipoGrafo)) {
          case 20: //Juego
            l1 = doc.splitTextToSize("Tipo de Grafo: Red de regalos de Cromos (\"red de relaciones\") entre Alumnos/Equipos en un Juego de Colección", 180);
            l2 = doc.splitTextToSize(`Juego seleccionado: ${this.juegoSeleccionado.NombreJuego}`, 180);
            break;

          default:
            break;
        }

        doc.text(l1, margenIzq, margenSup + 25);
        doc.text(l2, margenIzq, margenSup + 35);
        doc.text(datosFecha, margenIzq, margenSup + 48);

        //Generar la imagen con el Grafo                                   //NO FUNCIONA DE MOMENTO
        html2canvas(document.querySelector('#grafo')).then(canvas => {
          let imgData: string = canvas.toDataURL('image/jpeg', 1);

          //Insertar la imagen en el documento PDF
          doc.addImage(imgData, 'JPEG', margenIzq, margenSup + 55, 400, 100);
        });

        //Nombre del fichero y Guardado
        let filename: string = `GraficoActividadClasspip_${dia}-${mes}-${anyo}_${hora}-${minutos}.pdf`;
        doc.save(filename);

        this.cargandoGrafo = false;
      }
      else {
        this.cargandoGrafo = false;
        Swal.fire({
          title: "Cuidado",
          text: "Aún no has generado el Grafo",
          icon: "warning",
        });
      }
    }
  }
}
