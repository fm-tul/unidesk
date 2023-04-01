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
       N'20230330091100_InitialCreate',
       N'7.0.0'
     )
     ```
  
  5. Verify that the migration was created
  
     ```dotnet ef database update --project Unidesk```

### Add a new migration

  1. Run the following command to create a new migration
  
     ```dotnet ef migrations add  --project Unidesk <MigrationName>```
  
  2. Run the following command to update the database
  
     ```dotnet ef database update --project Unidesk```

## Publish

  1. Run the following command to publish the project in the Unidesk folder
  
     ```dotnet publish --os linux --arch x64 /t:PublishContainer -c Release```
