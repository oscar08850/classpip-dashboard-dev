import { Component, OnInit } from '@angular/core';
import { variable, ThrowStmt } from '@angular/compiler/src/output/output_ast';
import { Imagen } from '../../clases/clasesParaJuegoDeCuentos/RecursosCargaImagen';
import { PeticionesAPIService } from '../../servicios/peticiones-api.service';
import { SesionService } from '../../servicios/sesion.service';
import { ImagenToBackend } from '../../clases/clasesParaJuegoDeCuentos/ImagenGuardada';


@Component({
  selector: 'app-crear-recursos-cuento',
  templateUrl: './crear-recursos-cuento.component.html',
  styleUrls: ['./crear-recursos-cuento.component.scss']
})
export class CrearRecursosCuentoComponent implements OnInit {


  fileData: File = null;
  previewUrl: any = null;
  fileUploadProgress: string = null;
  uploadedFilePath: string = null;

  listadeFileFondo: any = [];
  listadeFilePersonajes: any = [];
  listadeFileObjetos: any = [];
  listadePreviewsPersonaje: any = [];
  listadePreviewsFondo: any = [];
  listadePreviewsObjeto: any = [];
  listaCompletaParaGuardar: any = [];

  listaGuardarUrl: any = [];

  nombreFamila: any;
  verFotos = false;
  ver = false;

  hacer = 0;

  files: any;

  nameFolder: string = null;
  cargaFiles: any = false;





  constructor(public API: PeticionesAPIService, public sesion: SesionService) { }

  ngOnInit() {
    var picker = document.getElementById('picker') as any;
    picker.filename = "Ey Vegeta"
  }

  fileProgress(fileInput: any, typefile: string) {
    this.fileData = fileInput.file;
    this.preview(typefile, fileInput.nombre);

  }

  preview(typefile: string, nombre: string) {
    // Show preview 
    var mimeType = this.fileData.type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }

    var reader = new FileReader();
    reader.readAsDataURL(this.fileData);
    reader.onload = (_event) => {
      this.previewUrl = reader.result;

      if (typefile == "fondo") {
        var imagen = new Imagen();
        console.log(imagen);
        imagen.file = this.previewUrl;
        imagen.nombre = nombre;
        imagen.especial = false;
        imagen.posicionLista = this.listadePreviewsFondo.length + 1;
        imagen.tipo = "fondo";
        this.listadePreviewsFondo.push(imagen);
      }
      else if (typefile == "personaje") {
        var imagen = new Imagen();
        imagen.file = this.previewUrl;
        imagen.nombre = nombre;
        imagen.especial = false;
        imagen.posicionLista = this.listadePreviewsPersonaje.length + 1;
        imagen.tipo = "personaje";
        this.listadePreviewsPersonaje.push(imagen);
      }
      else if (typefile == "objeto") {
        var imagen = new Imagen();
        imagen.file = this.previewUrl;
        imagen.nombre = nombre;
        imagen.especial = false;
        imagen.posicionLista = this.listadePreviewsObjeto.length + 1;
        imagen.tipo = "objeto";
        this.listadePreviewsObjeto.push(imagen);
      }
    }
  }



  onSubmit() {
    const formData = new FormData();
    formData.append('file', this.fileData);
    // this.service.postFoto(formData)
    //      .subscribe(res => {
    //         console.log(res); 
    //         console.log(res['path']  ); 
    //         this.cambiarPath(this.idGrupo, res); 
    //        //this.resetForm(form);
    //   //this.router.navigateByUrl("/tabs/tab1");

    //   })

    console.log("");

  }



  a(fileInput: any) {


    this.files = fileInput;
    console.log(fileInput);

    var picker = document.getElementById('picker');
    var listing = document.getElementById('listing');

    this.cargaFiles = true;
    this.verFotos = false

    this.listadeFileFondo = [];
    this.listadeFileObjetos = [];
    this.listadeFilePersonajes = [];
    this.listadePreviewsFondo = [];
    this.listadePreviewsPersonaje = [];
    this.listadePreviewsObjeto = [];
//HTMLInputEvent
    // picker.addEventListener('click', () => {

    //   for (let file of Array.from(fileInput.target.files) as any) { 

    //     // for (let file of Array.from(e.target.files) as any) { 


    //     let item = document.createElement('li');


    //     item.textContent = file.webkitRelativePath;
    //     var splitPath = item.textContent.split('/');
    //     this.nombreFamila = splitPath[0];

    //     if (this.verFotos == false) { this.verFotos = true; }

    //     listing.appendChild(item);


    //     if (file.webkitRelativePath.includes("fondos")) {
    //       var imagen = new Imagen();
    //       imagen.file = file;
    //       var nameSplitbarra = file.name.split('.');
    //       imagen.nombre = nameSplitbarra[0];
    //       this.listadeFileFondo.push(imagen);

    //     }
    //     if (file.webkitRelativePath.includes("personajes")) {
    //       var imagen = new Imagen();
    //       imagen.file = file;
    //       var nameSplitbarra = file.name.split('.');
    //       imagen.nombre = nameSplitbarra[0];
    //       this.listadeFilePersonajes.push(imagen);
    //     }
    //     if (file.webkitRelativePath.includes("objetos")) {
    //       var imagen = new Imagen();
    //       imagen.file = file;
    //       var nameSplitbarra = file.name.split('.');
    //       imagen.nombre = nameSplitbarra[0];
    //       this.listadeFileObjetos.push(imagen);
    //     }

    //   };
    //   this.listadeFileFondo.forEach(element => {
    //     this.fileProgress(element, "fondo");
    //   });
    //   this.listadeFilePersonajes.forEach(element => {
    //     this.fileProgress(element, "personaje");
    //   });
    //   this.listadeFileObjetos.forEach(element => {
    //     this.fileProgress(element, "objeto");
    //   });




    // });

 

  }


  b() {

    var picker = document.getElementById('picker');


    this.cargaFiles = false;

      for (let file of Array.from(this.files.target.files) as any) { 

        // for (let file of Array.from(e.target.files) as any) { 


        let item = document.createElement('li');



        item.textContent = file.webkitRelativePath;
        var splitPath = item.textContent.split('/');
        this.nombreFamila = splitPath[0];

        if (this.verFotos == false) { this.verFotos = true; }



        if (file.webkitRelativePath.includes("fondos")) {
          var imagen = new Imagen();
          imagen.file = file;
          var nameSplitbarra = file.name.split('.');
          imagen.nombre = nameSplitbarra[0];
          this.listadeFileFondo.push(imagen);

        }
        if (file.webkitRelativePath.includes("personajes")) {
          var imagen = new Imagen();
          imagen.file = file;
          var nameSplitbarra = file.name.split('.');
          imagen.nombre = nameSplitbarra[0];
          this.listadeFilePersonajes.push(imagen);
        }
        if (file.webkitRelativePath.includes("objetos")) {
          var imagen = new Imagen();
          imagen.file = file;
          var nameSplitbarra = file.name.split('.');
          imagen.nombre = nameSplitbarra[0];
          this.listadeFileObjetos.push(imagen);
        }

      };
      this.listadeFileFondo.forEach(element => {
        this.fileProgress(element, "fondo");
      });
      this.listadeFilePersonajes.forEach(element => {
        this.fileProgress(element, "personaje");
      });
      this.listadeFileObjetos.forEach(element => {
        this.fileProgress(element, "objeto");
      });




    


  }

  mostrar() {
    if (this.ver == true) {
      this.ver = false;
    }
    else {
      this.ver = true;
    }
  }
  // this.picker.addEventListener('change', e => {
  //   for (let file of Array.from(e.target.files) as any) {
  //     let item = document.createElement('li');
  //     item.textContent = file.webkitRelativePath;
  //     this.listing.appendChild(item);
  //   };
  // });


 

  guardar() {
    console.log ('Vamos a guardar el pack');


    this.listaCompletaParaGuardar = [];

    this.listadePreviewsObjeto.forEach(element => {
      this.listaCompletaParaGuardar.push(element);
    });
    this.listadePreviewsFondo.forEach(element => {
      this.listaCompletaParaGuardar.push(element);
    });

    this.listadePreviewsPersonaje.forEach(element => {
      this.listaCompletaParaGuardar.push(element);
    });



    this.nameFolder = "Recursos-" + this.nombreFamila;
    const postfolder =
    {
      'name': this.nameFolder
    }
    console.log ('voy a crear carpeta');
    console.log (postfolder);
    this.API.CrearCarpeta(postfolder).subscribe((res) => {
      console.log ('Carpeta creada');
      console.log ('voy a guardar las fotos');
      this.guardarLasFotos();

    }, (err) => {

    });
  }

  guardarLasFotos() {

    var i = 0;
    console.log ('Estoy en guardarLasFotos');
    console.log (this.listaCompletaParaGuardar);

    this.listaCompletaParaGuardar.forEach(file => {

      const formData: FormData = new FormData();

      var fileNew = this.dataURLtoFile(file.file, file.nombre + '.png');


      formData.append(fileNew.name, fileNew);
      console.log ('voy a guardar imagenes 1');


      this.API.GuardarImagenRecursoCuento(this.nameFolder, formData).subscribe((res) => {

        i = i + 1;
        var imageToBackend = new ImagenToBackend();

        imageToBackend.nombre = fileNew.name;
        imageToBackend.tipo = file.tipo;
        imageToBackend.url = fileNew.name;
        imageToBackend.especial = file.especial;

        this.listaGuardarUrl.push(imageToBackend);

        if (i == this.listaCompletaParaGuardar.length) {
          //llamada a la api
          console.log(this.listaGuardarUrl);



          const recursoSave = 
          {
            "nombre": this.nombreFamila,
            "carpeta": this.nameFolder,
            "imagenes": this.listaGuardarUrl
          }
          console.log ('voy a guardar imagenes 2');

          this.API.GuardarRecursoCuento(recursoSave, this.sesion.DameProfesor().id)
          .subscribe((res)=>{
            console.log(res);
          }, (err)=>{
            console.log(err);
          })

        }


      }, (err) => {
        console.log(err);

      });
    });

  }


  dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }







}
