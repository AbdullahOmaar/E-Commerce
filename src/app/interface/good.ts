export interface Country {
  name?: string;
  code?: string;
}

export interface Representative {
  name?: string;
  image?: string;
}

export interface Good {
  id?: string,
  name?: string,
  price?: number,
  photoUrl?: string,
  amount?: number,
  code?:string;
  description?:string;
  discription?:string;
  quantity?:number;
  inventoryStatus?:string;
  category?:string;
  image?:string;
  rating?:number;
  country?: Country;
  company?: string;
  date?: Date;
  status?: string;
  discount?: number;
  representative?: Representative;
}



