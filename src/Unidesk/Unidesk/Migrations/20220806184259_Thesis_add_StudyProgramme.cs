using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Unidesk.Migrations
{
    public partial class Thesis_add_StudyProgramme : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "StudyProgrammeId",
                table: "Theses",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Theses_StudyProgrammeId",
                table: "Theses",
                column: "StudyProgrammeId");

            migrationBuilder.AddForeignKey(
                name: "FK_Theses_StudyProgrammes_StudyProgrammeId",
                table: "Theses",
                column: "StudyProgrammeId",
                principalTable: "StudyProgrammes",
                principalColumn: "Id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Theses_StudyProgrammes_StudyProgrammeId",
                table: "Theses");

            migrationBuilder.DropIndex(
                name: "IX_Theses_StudyProgrammeId",
                table: "Theses");

            migrationBuilder.DropColumn(
                name: "StudyProgrammeId",
                table: "Theses");
        }
    }
}
