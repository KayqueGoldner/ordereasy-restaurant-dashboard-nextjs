import { Product } from "@/db/schema/product";

export const products: Product[] = [
  {
    id: "asvrfbbr1",
    name: "Classic Burger",
    description: "Brioche bun, Angus beef, cheddar cheese, and special sauce.",
    price: "25.90",
    imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd",
    category: "main_course",
    isAvailable: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "asvrfbbr2",
    name: "Pepperoni Pizza",
    description: "Tomato sauce, mozzarella cheese, and pepperoni slices.",
    price: "49.90",
    imageUrl: "https://images.unsplash.com/photo-1564128442383-9201fcc740eb",
    category: "main_course",
    isAvailable: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "asvrfbbr3",
    name: "Chocolate Milkshake",
    description: "Creamy milkshake with Belgian chocolate and whipped cream.",
    price: "18.50",
    imageUrl: "https://images.unsplash.com/photo-1528740096961-3798add19cb7",
    category: "beverage",
    isAvailable: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "asvrfbbr4",
    name: "Chicken Nuggets",
    description: "Crispy golden chicken nuggets served with BBQ sauce.",
    price: "22.00",
    imageUrl: "https://images.unsplash.com/photo-1585703900468-13c7a978ad86",
    category: "appetizer",
    isAvailable: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "asvrfbbr5",
    name: "Caesar Salad",
    description:
      "Fresh romaine lettuce, parmesan cheese, croutons, and Caesar dressing.",
    price: "29.50",
    imageUrl: "https://images.unsplash.com/photo-1551248429-40975aa4de74",
    category: "side",
    isAvailable: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];
