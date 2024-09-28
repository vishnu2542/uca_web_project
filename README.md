# BizBalance

BizBalance is a small vendor business management system website built using HTML, CSS, and JavaScript. The platform helps vendors efficiently manage their stock, sales, expenses, and view financial statistics like profit and expenses using day-wise graphs.
live link:https://vishnu2542.github.io/uca_web_project/

## Table of Contents
- [Features](#features)
- [Pages Overview](#pages-overview)
- [Technologies Used](#technologies-used)
- [Future Enhancements](#future-enhancements)

## Features

1. User Authentication: Users can sign up and log in using local storage for data persistence.
2. Dashboard: After login, users are taken to the dashboard where they can:
   - View the current balance.
   - Manage stocks, sales, and expenses through interactive features.
   - View graphical representations of day-wise profit and expenses.
3. Responsive Design: The website is fully responsive, utilizing media queries for an optimized mobile and desktop experience.
4. About Us and Contact Us Pages: Detailed information and ways to contact the team behind BizBalance.

## Pages Overview

### 1. Welcome Page
   - Contains:
     - Header: Includes the website logo, navigation links to About Us and Contact Us pages.
     - Login Button: Leads users to the login/sign-up page.
     - Footer: Includes social media links.
   
### 2. Login/Sign-Up Page
   - Allows users to either log in or create an account.
   - User data is stored in the browser's local storage to persist across sessions.
   
### 3. Dashboard
   - Upon successful login, users are directed to the dashboard.
   - Header: Contains the logo, user profile information, and links to About Us and Contact Us sections.
   - Main Content:
     - Displays the Current Balance.
     - Four interactive buttons:
       1. Stock Management
       2. Sales Management
       3. Expenses 
       4. profit summary      
   - Provides a clear and intuitive interface for users to manage their business.

### 4. About Us
   - Describes the mission and team behind BizBalance.

### 5. Contact Us
   - Provides contact information for users to reach out for support or inquiries.

## Functional Modules

### 1. Stock Management
In the Stock Management section, users can input details about the products they have in stock, including:
   - Product Name: The name of the item.
   - Quantity: The number of units in stock.
   - Price per Unit: The cost of each unit.
Button Add/Update stock and then it asks for profit % and then update in table
Once the user inputs these details, they are displayed in a table format, allowing users to easily view and manage their stock inventory. The table allows users to:
   - Delete stock items that are no longer available.

### 2. Sales Management
The Sales Management section helps users track their daily sales. Users can input:
   - Item Sold: The name of the product that was sold.
   - Quantity Sold: How many units were sold.

The sales data is stored and displayed in a table, giving a clear overview of daily profit activity from particular product. Users can view all past sales, update incorrect entries, or remove records if necessary.

### 3. Expenses
In the Expenses section, users can track their business expenses by inputting:
   - Expense Description: A brief description of the expense (e.g., "Office Rent", "Utility Bills", "Supplier Payments").
   - Amount: The amount of money spent.
   
The expenses are displayed in a table format, allowing users to easily monitor and manage their business expenditures.

### 4. Profit Summary
The Profit Summary section provides an overall view of the business's financial performance by comparing the total sales and expenses.
The profit summary includes two graphical representations:
   - Day-wise Profit: A line chart or bar graph showing profit trends over time.
   - Expenses Graph: A separate graph visualizing the business's expenses over a given period.

This allows users to track their financial performance visually and identify key trends.

## Technologies Used

- HTML5: For structuring the website.
- CSS3: For styling and creating a responsive design using media queries.
- JavaScript: For handling interactions, user login, sign-up functionality, and storing data in local storage.
- Local Storage: To persist user data like login details across sessions.
- API integrtion: Used Chart.js for visualization.
    
## Future Enhancements

- AI Integration: Plan to add AI-based features to provide intelligent business insights and recommendations.
- Khatabook System: Integration of a khatabook (ledger) system to further simplify expense tracking and vendor management.
- More Features: Continuously evolving to add more tools and capabilities for vendors to manage all aspects of their business in one place.

