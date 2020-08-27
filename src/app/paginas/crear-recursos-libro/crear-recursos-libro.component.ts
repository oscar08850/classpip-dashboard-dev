import { Component, OnInit } from '@angular/core';
import { variable, ThrowStmt } from '@angular/compiler/src/output/output_ast';
import { Imagen } from '../../clases/clasesParaLibros/recursosCargaImagen';
import { PeticionesAPIService } from '../../servicios/peticiones-api.service';
import { SesionService } from '../../servicios/sesion.service';


import { ImagenToBackend } from '../../clases/clasesParaLibros/imagenGuardada';
import { TablaHistorialPuntosAlumno } from 'src/app/clases';



@Component({
  selector: 'app-crear-recursos-libro',
  templateUrl: './crear-recursos-libro.component.html',
  styleUrls: ['./crear-recursos-libro.component.scss']
})
export class CrearRecursosLibroComponent implements OnInit {



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

  nameFolder: string = null;

  constructor(public API: PeticionesAPIService, public sesion: SesionService) { }

  ngOnInit() {
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

    var picker = document.getElementById('picker');
    var listing = document.getElementById('listing');


    picker.addEventListener('change', e => {

      for (let file of Array.from(e.target.files) as any) { 

        // for (let file of Array.from(e.target.files) as any) { 


        let item = document.createElement('li');


        item.textContent = file.webkitRelativePath;
        var splitPath = item.textContent.split('/');
        this.nombreFamila = splitPath[0];

        if (this.verFotos == false) { this.verFotos = true; }

        listing.appendChild(item);


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


  setAll(imagen: Imagen) {

    if (imagen.especial == false) {
      imagen.especial = true;
      if (imagen.tipo == "fondo") {
        this.listadePreviewsFondo[imagen.posicionLista -1 ] = imagen;
      }
      else if (imagen.tipo == "personaje") {
        this.listadePreviewsPersonaje[imagen.posicionLista -1] = imagen;
      }     



      
      else if (imagen.tipo == "objeto") {
        this.listadePreviewsObjeto[imagen.posicionLista -1] = imagen;
      }
    }

    else if (imagen.especial == true) {
      imagen.especial = false;
      if (imagen.tipo == "fondo") {
        this.listadePreviewsFondo[imagen.posicionLista-1] = imagen;
      }
      else if (imagen.tipo == "personaje") {
        this.listadePreviewsPersonaje[imagen.posicionLista-1] = imagen;
      }
      else if (imagen.tipo == "objeto") {
        this.listadePreviewsObjeto[imagen.posicionLista-1] = imagen;
      }
    }
  }

  guardar() {


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
    this.API.crearCarpeta(postfolder).subscribe((res) => {

      this.guardarLasFotos();

    }, (err) => {

    });
  }

  guardarLasFotos() {

    var i = 0;

    this.listaCompletaParaGuardar.forEach(file => {

      const formData: FormData = new FormData();

      var fileNew = this.dataURLtoFile(file.file, file.nombre + '.png');


      formData.append(fileNew.name, fileNew);


      this.API.guardarImagenRecursoLibro(this.nameFolder, formData).subscribe((res) => {

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

          this.API.guardarRecursoLibro(recursoSave, this.sesion.DameProfesor().id)
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
