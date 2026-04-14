# Hotel Management System

A simple hotel management application built with ASP.NET Core MVC, Entity Framework Core, PostgreSQL, and Cloudflare R2 for file storage.

## Features

- **Add Customer**: Register new customers with name, phone, ID proof file upload, check-in and check-out dates
- **View All Customers**: List all customers with status indicators
- **Search by Phone**: Find customers by phone number
- **Checkout**: Mark customers as checked out
- **ID Proof Storage**: Upload ID proof documents to Cloudflare R2

## Prerequisites

- .NET 9.0 SDK
- PostgreSQL database
- Cloudflare R2 account (for file storage)

## Setup Instructions

### 1. Database Configuration

Update the connection string in `appsettings.json`:

```json
"ConnectionStrings": {
  "DefaultConnection": "Host=localhost;Port=5432;Database=HotelManagement;Username=postgres;Password=your_password"
}
```

### 2. Cloudflare R2 Configuration

Update the R2 settings in `appsettings.json`:

```json
"R2Settings": {
  "AccountId": "your_cloudflare_account_id",
  "AccessKeyId": "your_r2_access_key_id",
  "SecretAccessKey": "your_r2_secret_access_key",
  "BucketName": "hotel-id-proofs",
  "PublicUrl": "https://your-public-r2-domain.com"
}
```

#### Getting R2 Credentials

1. Log in to Cloudflare dashboard
2. Go to R2 > Overview
3. Create a new bucket (e.g., `hotel-id-proofs`)
4. Go to R2 > Manage R2 API Tokens
5. Create a new API token with read/write permissions
6. Copy the Access Key ID and Secret Access Key
7. Your Account ID is in the URL or R2 dashboard

### 3. Apply Database Migrations

```bash
dotnet ef database update
```

Or the app will automatically apply migrations on startup in development mode.

### 4. Run the Application

```bash
dotnet run
```

The application will be available at `https://localhost:5001` or `http://localhost:5000`.

## Project Structure

```
HotelManagement/
├── Controllers/
│   └── CustomersController.cs    # Customer CRUD operations
├── Data/
│   └── HotelDbContext.cs         # EF Core database context
├── Migrations/                    # EF Core migrations
├── Models/
│   ├── Customer.cs               # Customer entity
│   └── CustomerViewModel.cs      # View models
├── Services/
│   ├── IFileUploadService.cs     # File upload interface
│   ├── R2FileUploadService.cs    # Cloudflare R2 implementation
│   └── R2Settings.cs             # R2 configuration model
├── Views/
│   └── Customers/
│       ├── Index.cshtml          # Customer list view
│       ├── Create.cshtml         # Add new customer form
│       └── Details.cshtml        # Customer details view
├── Program.cs                     # Application entry point
└── appsettings.json              # Configuration
```

## Technologies Used

- **ASP.NET Core MVC 9.0** - Web framework
- **Entity Framework Core 9.0** - ORM
- **Npgsql** - PostgreSQL provider for EF Core
- **AWS SDK for .NET (S3)** - Cloudflare R2 API (S3-compatible)
- **Bootstrap 5** - UI framework
- **Bootstrap Icons** - Icon library

## License

MIT
