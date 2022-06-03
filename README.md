# Unidesk &middot; [![Coverage Status](https://img.shields.io/coveralls/github/fm-tul/unidesk?logo=coveralls&style=flat-square)](https://coveralls.io/github/fm-tul/unidesk?branch=master)

Application for managing univeristy bachelor/master/dissertation theses.



## Development

### Database & Migration

Use `dotnet ef` command ([dotnet-ef](https://docs.microsoft.com/en-us/ef/core/cli/dotnet) tool).

 - To create new migration use
   ```
   dotnet ef migrations add  --project Unidesk <name>
   ```

 - To apply migration use
   ```
   dotnet ef database update --project Unidesk
   ```

- To revert migration use
    ```
    dotnet ef database update --project Unidesk --migration <name>
    ```
    
- To delete migration use
    ```
    dotnet ef migrations remove --project Unidesk
    ```
