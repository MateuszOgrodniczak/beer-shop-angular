import {Address} from './address';

export class Shop {
  constructor(
    public id: number,
    public name: string,
    public street: string,
    public postalCode: string,
    public city: string,
    public phone: string,
    public email: string,
    public ownerName: string
  ) {  }
}
