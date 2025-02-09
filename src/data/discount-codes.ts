export const DiscountCodes = [
  {
    code: "SAVE10",
    expires: new Date(new Date().setDate(new Date().getDate() + 7)), // Expira em 7 dias
    amount: 10,
  },
  {
    code: "WELCOME5",
    expires: new Date(new Date().setDate(new Date().getDate() + 30)), // Expira em 30 dias
    amount: 5,
  },
  {
    code: "FREESHIP",
    expires: new Date(new Date().setDate(new Date().getDate() + 15)), // Expira em 15 dias
    amount: 0,
  },
  {
    code: "EXPIRED",
    expires: new Date(new Date().setDate(new Date().getDate() - 1)), // Expirado
    amount: 5,
  },
];
