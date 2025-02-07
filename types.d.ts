interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

interface CartItem {
  id: string | number;
  image: string;
  name: string;
  price: number;
  quantity: number;
}
