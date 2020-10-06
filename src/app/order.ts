import {Product} from './product';

export class Order {
  constructor(
    public id: number,
    public cost: number,
    public date: Date,
    public products: Map<number, number>,
    public productsWrapper: {},
    public clientName: string
  ) {}
}
