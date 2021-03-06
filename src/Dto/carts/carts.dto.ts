import { IsArray, IsNumber, IsString } from "class-validator";

export class ICart {
  [x: string]: any;
  @IsNumber()
  date: number;
  @IsString()
  customerRef: string;
  @IsNumber()
  status: number;
  _id?: any;
  @IsArray()
  items: [
    {
      quantity: number;
      productRefId: string;
      _id: string;
    }
  ];
}
