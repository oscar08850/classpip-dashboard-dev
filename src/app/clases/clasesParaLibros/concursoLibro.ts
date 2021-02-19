export class concursoLibro {
    
    concursoTematica: any
    dateFinInscripcion: any;
    dateFinVotacion: any;
    concursoRequisitos: any;
    concursoPrimerCriterio: any;
    concursoSegundoCriterio: any;
    concursoTercerCriterio: any;
    id: any;
    juegoId: any;
    listaLibrosParticipantes: any;
    peso1: any;
    peso2: any;
    peso3: any;
    acabado: boolean;
    primerpuesto: any;
    segundopuesto: any;
    tercerpuesto: any;


    constructor(concursoTematica?: any, dateFinInscripcion?: any, tipo?:any, dateFinVotacion?:any,  concursoRequisitos?:any,  concursoPrimerCriterio?:any, concursoSegundoCriterio?: any,
        concursoTercerCriterio?: any) {
  
      this.concursoTematica = concursoTematica;
      this.dateFinInscripcion = dateFinInscripcion;
      this.dateFinVotacion = dateFinVotacion;
      this.concursoRequisitos = concursoRequisitos;
      this.concursoPrimerCriterio = concursoPrimerCriterio;
      this.concursoSegundoCriterio = concursoSegundoCriterio;
      this.concursoTercerCriterio = concursoTercerCriterio;
;
    }
  }
  

