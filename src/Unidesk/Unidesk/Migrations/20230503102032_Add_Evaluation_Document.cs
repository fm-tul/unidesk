using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Unidesk.Migrations
{
    /// <inheritdoc />
    public partial class AddEvaluationDocument : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "DocumentId",
                table: "Evaluations",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Evaluations_DocumentId",
                table: "Evaluations",
                column: "DocumentId");

            migrationBuilder.AddForeignKey(
                name: "FK_Evaluations_Documents_DocumentId",
                table: "Evaluations",
                column: "DocumentId",
                principalTable: "Documents",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Evaluations_Documents_DocumentId",
                table: "Evaluations");

            migrationBuilder.DropIndex(
                name: "IX_Evaluations_DocumentId",
                table: "Evaluations");

            migrationBuilder.DropColumn(
                name: "DocumentId",
                table: "Evaluations");
        }
    }
}
