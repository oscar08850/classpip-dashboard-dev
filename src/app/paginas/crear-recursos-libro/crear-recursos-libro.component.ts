import { Component, OnInit } from '@angular/core';
import { variable } from '@angular/compiler/src/output/output_ast';

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
  listadePreviewsFondo: any = [];


  constructor() { }

  ngOnInit() {
  }

  fileProgress(fileInput: any) {
    this.fileData = fileInput;
    this.preview();

  }

  preview() {
    // Show preview 
    var mimeType = this.fileData.type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }

    var reader = new FileReader();
    reader.readAsDataURL(this.fileData);
    reader.onload = (_event) => {
      this.previewUrl = reader.result;
      this.listadePreviewsFondo.push(this.previewUrl);
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
        listing.appendChild(item);
       

        if (file.webkitRelativePath.includes("fondos")) {
          this.listadeFileFondo.push(file);
        }
        if (file.webkitRelativePath.includes("personajes")) {
          this.listadeFilePersonajes.push(file);
        }
        if (file.webkitRelativePath.includes("objetos")) {
          this.listadeFileObjetos.push(file);
        }

      };
      this.listadeFileFondo.forEach(element => {
        this.fileProgress(element)
      });
    });

    
  }

  // this.picker.addEventListener('change', e => {
  //   for (let file of Array.from(e.target.files) as any) {
  //     let item = document.createElement('li');
  //     item.textContent = file.webkitRelativePath;
  //     this.listing.appendChild(item);
  //   };
  // });


}
