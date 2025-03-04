interface CartItem {
  id: string;
  image: string;
  name: string;
  price: string;
  quantity: number;
  note?: string | null;
}

interface Discounts {
  code: string;
  amount: number;
}
