interface Product {
  id: string;
  imageUrl: string;
  name: string;
  description: string;
  categoryName: string;
  price: string;
  calories: string;
  ingredients: string;
  allergens: string;
  preparationTime: number;
  serves: number;
  quantity: number;
  note?: string | null;
}

interface Discounts {
  code: string;
  amount: number;
}
