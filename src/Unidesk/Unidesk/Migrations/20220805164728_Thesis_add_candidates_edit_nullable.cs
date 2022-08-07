using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Unidesk.Migrations
{
    public partial class Thesis_add_candidates_edit_nullable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Theses_ThesisTypes_ThesisTypeId",
                table: "Theses");

            migrationBuilder.AddColumn<Guid>(
                name: "ThesisId",
                table: "ThesisTypes",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AlterColumn<Guid>(
                name: "ThesisTypeId",
                table: "Theses",
                type: "uniqueidentifier",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier");

            migrationBuilder.AlterColumn<long>(
                name: "Adipidno",
                table: "Theses",
                type: "bigint",
                nullable: true,
                oldClrType: typeof(long),
                oldType: "bigint");

            migrationBuilder.CreateIndex(
                name: "IX_ThesisTypes_ThesisId",
                table: "ThesisTypes",
                column: "ThesisId");

            migrationBuilder.AddForeignKey(
                name: "FK_Theses_ThesisTypes_ThesisTypeId",
                table: "Theses",
                column: "ThesisTypeId",
                principalTable: "ThesisTypes",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_ThesisTypes_Theses_ThesisId",
                table: "ThesisTypes",
                column: "ThesisId",
                principalTable: "Theses",
                principalColumn: "Id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Theses_ThesisTypes_ThesisTypeId",
                table: "Theses");

            migrationBuilder.DropForeignKey(
                name: "FK_ThesisTypes_Theses_ThesisId",
                table: "ThesisTypes");

            migrationBuilder.DropIndex(
                name: "IX_ThesisTypes_ThesisId",
                table: "ThesisTypes");

            migrationBuilder.DropColumn(
                name: "ThesisId",
                table: "ThesisTypes");

            migrationBuilder.AlterColumn<Guid>(
                name: "ThesisTypeId",
                table: "Theses",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier",
                oldNullable: true);

            migrationBuilder.AlterColumn<long>(
                name: "Adipidno",
                table: "Theses",
                type: "bigint",
                nullable: false,
                defaultValue: 0L,
                oldClrType: typeof(long),
                oldType: "bigint",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Theses_ThesisTypes_ThesisTypeId",
                table: "Theses",
                column: "ThesisTypeId",
                principalTable: "ThesisTypes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
