interface Product {
  id: string;
  imageUrl: string;
  name: string;
  description: string;
  categoryName: string;
  price: string;
  quantity: number;
  note?: string | null;
}

interface Discounts {
  code: string;
  amount: number;
}
