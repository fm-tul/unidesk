using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Unidesk.Migrations
{
    /// <inheritdoc />
    public partial class AddDocumentOnCacsadeDelete : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_DocumentContents_Documents_DocumentId",
                table: "DocumentContents");

            migrationBuilder.AddForeignKey(
                name: "FK_DocumentContents_Documents_DocumentId",
                table: "DocumentContents",
                column: "DocumentId",
                principalTable: "Documents",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_DocumentContents_Documents_DocumentId",
                table: "DocumentContents");

            migrationBuilder.AddForeignKey(
                name: "FK_DocumentContents_Documents_DocumentId",
                table: "DocumentContents",
                column: "DocumentId",
                principalTable: "Documents",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
