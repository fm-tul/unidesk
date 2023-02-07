# Unidesk

## EF Migrations

### Restart Migration history

  1. Remove the Migrations folder
  2. Remove the __EFMigrationsHistory table from the database
  3. Run the following command to create a new migration
  
     ```dotnet ef migrations add InitialCreate --project Unidesk```
  
  4. Run the following SQL command to update the database
  
     ```
     INSERT dbo.__EFMigrationsHistory
     (
       MigrationId,
       ProductVersion
     )
     VALUES
     (
       N'20230207104456_InitialCreate',
       N'7.0.0'
     )
     ```
  
  5. Verify that the migration was created
  
     ```dotnet ef database update --project Unidesk```