import { Component, OnInit } from '@angular/core';
import { variable, ThrowStmt } from '@angular/compiler/src/output/output_ast';
import { Imagen } from '../../clases/clasesParaLibros/recursosCargaImagen';

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

  nombreFamila: any;
  verFotos = false;
  ver = false;

  constructor() { }

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
        this.listadePreviewsFondo.push(imagen);
      }
      else if (typefile == "personaje") {
        var imagen = new Imagen();
        imagen.file = this.previewUrl;
        imagen.nombre = nombre;
        this.listadePreviewsPersonaje.push(imagen);
       }
      else if (typefile == "objeto") { 
        var imagen = new Imagen();
        imagen.file = this.previewUrl;
        imagen.nombre = nombre;
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
        let item = document.createElement('li');
        item.textContent = file.webkitRelativePath;
        var splitPath = item.textContent.split('/');
        this.nombreFamila = splitPath[0];
        
        if(this.verFotos == false){ this.verFotos = true;}

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
        this.fileProgress(element,"fondo");
      });
      this.listadeFilePersonajes.forEach(element => {
        this.fileProgress(element,"personaje");
      });
      this.listadeFileObjetos.forEach(element => {
        this.fileProgress(element,"objeto");
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


  setAll(evento)
  {}

}
