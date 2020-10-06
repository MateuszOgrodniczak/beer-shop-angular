import {SafeUrl} from '@angular/platform-browser';

export class Product {
  constructor(
    public id: number,
    public name: string,
    public description: string,
    public cost: number,
    public image: File,
    public imageUrl: SafeUrl
  ) {}
}
