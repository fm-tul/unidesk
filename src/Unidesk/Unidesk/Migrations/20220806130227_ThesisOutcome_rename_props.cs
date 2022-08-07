using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Unidesk.Migrations
{
    public partial class ThesisOutcome_rename_props : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Name",
                table: "ThesisOutcomes",
                newName: "NameEng");

            migrationBuilder.RenameColumn(
                name: "Description",
                table: "ThesisOutcomes",
                newName: "DescriptionEng");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "NameEng",
                table: "ThesisOutcomes",
                newName: "Name");

            migrationBuilder.RenameColumn(
                name: "DescriptionEng",
                table: "ThesisOutcomes",
                newName: "Description");
        }
    }
}
