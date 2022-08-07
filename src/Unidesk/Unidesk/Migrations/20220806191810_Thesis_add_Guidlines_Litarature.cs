using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Unidesk.Migrations
{
    public partial class Thesis_add_Guidlines_Litarature : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Guidelines",
                table: "Theses",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Literature",
                table: "Theses",
                type: "nvarchar(max)",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Guidelines",
                table: "Theses");

            migrationBuilder.DropColumn(
                name: "Literature",
                table: "Theses");
        }
    }
}
