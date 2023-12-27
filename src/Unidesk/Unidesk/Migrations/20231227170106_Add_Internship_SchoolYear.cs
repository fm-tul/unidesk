using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Unidesk.Migrations
{
    /// <inheritdoc />
    public partial class AddInternshipSchoolYear : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "SchoolYearId",
                table: "Internships",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Internships_SchoolYearId",
                table: "Internships",
                column: "SchoolYearId");

            migrationBuilder.AddForeignKey(
                name: "FK_Internships_SchoolYears_SchoolYearId",
                table: "Internships",
                column: "SchoolYearId",
                principalTable: "SchoolYears",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Internships_SchoolYears_SchoolYearId",
                table: "Internships");

            migrationBuilder.DropIndex(
                name: "IX_Internships_SchoolYearId",
                table: "Internships");

            migrationBuilder.DropColumn(
                name: "SchoolYearId",
                table: "Internships");
        }
    }
}
