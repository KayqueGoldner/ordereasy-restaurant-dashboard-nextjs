interface Product {
  id: string;
  imageUrl: string;
  name: string;
  description: string;
  categoryName: string;
  price: string;
  calories: number;
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

interface ProductsListFilter {
  maxPrice?: string;
  maxPreparationTime?: number;
  minimumServes?: number;
  maxCalories?: number;
  ingredients?: string;
  allergens?: string;
}
