# Unidesk &middot; [![Coverage Status](https://img.shields.io/coveralls/github/fm-tul/unidesk?logo=coveralls&style=flat-square)](https://coveralls.io/github/fm-tul/unidesk?branch=master) [![Codacy grade](https://img.shields.io/codacy/grade/38c0567216c84e70bf390bb80a1837aa?logo=codacy&style=flat-square)](https://www.codacy.com/gh/fm-tul/unidesk/dashboard?utm_source=github.com&utm_medium=referral&utm_content=fm-tul/unidesk&utm_campaign=Badge_Grade)

Application for managing univeristy bachelor/master/dissertation theses.

## Development

### Database & Migration

Use `dotnet ef` command ([dotnet-ef](https://docs.microsoft.com/en-us/ef/core/cli/dotnet) tool).

- To create new migration use

```bash
dotnet ef migrations add  --project Unidesk <name>
```

- To apply migration use

```bash
dotnet ef database update --project Unidesk
```

- To revert migration use

```bash
dotnet ef database update --project Unidesk --migration <name>
```

- To delete migration use

```bash
dotnet ef migrations remove --project Unidesk
```

- To restart all migrations use, delete Migration folder

```bash
dotnet ef migrations add  --project Unidesk InitialCreate
dotnet ef database update --project Unidesk
```
