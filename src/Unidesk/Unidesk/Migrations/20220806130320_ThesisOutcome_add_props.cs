using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Unidesk.Migrations
{
    public partial class ThesisOutcome_add_props : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "DescriptionCze",
                table: "ThesisOutcomes",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "NameCze",
                table: "ThesisOutcomes",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DescriptionCze",
                table: "ThesisOutcomes");

            migrationBuilder.DropColumn(
                name: "NameCze",
                table: "ThesisOutcomes");
        }
    }
}
