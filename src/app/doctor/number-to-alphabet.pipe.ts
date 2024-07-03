import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'numberToAlphabet' })
export class NumberToAlphabetPipe implements PipeTransform {
  transform(index: number): string {
    return String.fromCharCode(65 + index); // A = 65 in ASCII
  }
}
