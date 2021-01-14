import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'exclude'
})
export class ExcludePipe implements PipeTransform {

  transform(items: Array<any>, exclude: any): Array<any> {
    if (!items || !exclude) {
      return items;
    }
    return items.filter(item => item !== exclude);
  }

}
