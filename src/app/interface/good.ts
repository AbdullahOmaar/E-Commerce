export interface Country {
  name?: string;
  code?: string;
}

export interface Representative {
  name?: string;
  image?: string;
}

export interface Good {
  id?: string;
  DataId?: string;
  name?: string;
  price?: number;
  photoUrl?: string;
  amount?: number;
  code?: string;
  description?: string;
  quantity?: number;
  inventoryStatus?: string;
  category?: string;
  image?: string;
  rating?: number;
  country?: Country | string;
  company?: string;
  date?: Date;
  status?: string;
  discount?: number;
  representative?: Representative;
}
