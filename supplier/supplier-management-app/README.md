# Supplier Management App

## Overview
The Supplier Management App is a web application designed to manage supplier information efficiently. It allows users to add, view, and save supplier details, making it easier to keep track of suppliers in one centralized location.

## Features
- Add single or multiple suppliers manually.
- View a list of all added suppliers.
- Save all supplier details with a single click.
- User-friendly interface for managing supplier data.

## Project Structure
```
supplier-management-app
├── src
│   ├── app
│   │   └── suppliers
│   │       ├── page.tsx
│   │       └── components
│   │           ├── SupplierForm.tsx
│   │           ├── SupplierList.tsx
│   │           └── SupplierActions.tsx
│   ├── types
│   │   └── supplier.ts
│   └── styles
│       └── suppliers.css
├── package.json
├── tsconfig.json
└── README.md
```

## Installation
1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd supplier-management-app
   ```
3. Install the dependencies:
   ```
   npm install
   ```

## Usage
To start the application, run:
```
npm start
```
This will launch the application in your default web browser.

## Contributing
Contributions are welcome! Please feel free to submit a pull request or open an issue for any enhancements or bug fixes.

## License
This project is licensed under the MIT License. See the LICENSE file for more details.