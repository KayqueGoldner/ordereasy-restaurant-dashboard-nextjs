# OrderEasy Restaurant Dashboard

**A modern restaurant management dashboard built with Next.js that allows restaurant owners to manage inventory, track sales, analyze reports, and handle user settings. The application provides a seamless experience for restaurant administrators.**

![Application Screenshot](/ordereasy-dashboard.png "Application Screenshot")
![Application Screenshot](/report-ordereasy-dashboard.png "Application Screenshot")  

## 🚀 Features  

- **Inventory Management**: Add, edit, and remove products from your restaurant inventory.
- **Sales Reporting**: View comprehensive sales data with customizable date ranges.
- **Analytics Dashboard**: Visualize sales performance with interactive charts.
- **User Management**: Secure user authentication and profile management.
- **Admin Control**: Full access for admin users to manage all aspects of the system.
- **Favorite Products Tracking**: Identify your best-selling items.
- **Order History**: Track all orders with detailed information.
- **Discount Management**: Create and manage promotional discounts.
- **Responsive Design**: Works seamlessly on all device sizes.


## 🛠️ Technologies Used  

- **Frontend**:  
  - [Next.js](https://nextjs.org/) - React framework with server-side rendering capabilities.
  - [React](https://react.dev/) - JavaScript library for building user interfaces.

- **Backend**:  
  - [tRPC](https://trpc.io/) - End-to-end typesafe APIs for your Next.js application.
  - [Auth.js](https://authjs.dev/) - Authentication solution for Next.js applications.
  - [Neon Database](https://neon.tech/) - Serverless Postgres database.  
  - [Drizzle ORM](https://orm.drizzle.team/) - TypeScript ORM for SQL databases.

- **Programming Language**:  
  - [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript for robust development.  

- **Styling**:  
  - [TailwindCSS](https://tailwindcss.com/) - Utility-first CSS framework.  
  - [Shadcn UI](https://ui.shadcn.com/) - A collection of accessible and customizable UI components.  

## 📦 NPM Packages  

- [React Hook Form](https://www.react-hook-form.com/) - Performant form validation.
- [Zod](https://zod.dev/) - TypeScript-first schema validation.
- [date-fns](https://date-fns.org/) - Modern JavaScript date utility library.
- [Drizzle Kit](https://orm.drizzle.team/kit-docs/overview) - Database migration and management tools.

## 💻 Setup

Follow these steps to set up and run the application locally:

### 1. Clone the Repository

```bash
git clone https://github.com/KayqueGoldner/ordereasy-restaurant-dashboard-nextjs.git
cd ordereasy-restaurant-dashboard-nextjs
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

```bash
NEXT_PUBLIC_APP_URL=http://localhost:3000

AUTH_SECRET=
AUTH_GITHUB_ID=
AUTH_GITHUB_SECRET=
AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=

DATABASE_URL=

NEXT_PUBLIC_STRIPE_PUBLIC_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

UPLOADTHING_SECRET=
UPLOADTHING_TOKEN=
```

### 4. Set Up the Database

```bash
npm run db:generate
npm run db:migrate
npm run seed
```

### 5. Run the Application

```bash
npm run dev
```

### 6. Access the Application

**You can access the application by opening the following URL in your browser:
http://localhost:3000**

## 📚 Database Management  

- Generate database schema: `npm run db:generate`
- Apply migrations: `npm run db:migrate`
- Seed the database with sample data: `npm run seed`
- Open Drizzle Studio to manage database: `npm run db:studio`

## 🔒 Authentication 
The application uses Auth.js for secure authentication. Admin users have access to all features including inventory management and sales reporting.

## 📊 Reporting Features

- **Sales Overview:** View total sales, average order value, and order count.
- **Top Products:** Identify your most popular menu items.
- **Sales Charts:** Visualize sales trends with customizable time periods (monthly, quarterly, yearly).
- **Discount Analysis:** Track the performance of your promotional campaigns.

## 🤝 Contribute

1. Fork this repository.
2. Create a branch for your changes (`git checkout -b feature/new-feature`).
3. Commit your changes (`git commit -m 'Add new feature'`).
4. Push to the branch (`git push origin feature/new-feature`).
5. Open a Pull Request.

All contributions are welcome!


## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
