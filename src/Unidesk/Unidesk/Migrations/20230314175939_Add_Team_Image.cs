using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Unidesk.Migrations
{
    /// <inheritdoc />
    public partial class AddTeamImage : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Avatar",
                table: "Teams");

            migrationBuilder.AddColumn<Guid>(
                name: "ProfileImageId",
                table: "Teams",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Teams_ProfileImageId",
                table: "Teams",
                column: "ProfileImageId");

            migrationBuilder.AddForeignKey(
                name: "FK_Teams_Documents_ProfileImageId",
                table: "Teams",
                column: "ProfileImageId",
                principalTable: "Documents",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Teams_Documents_ProfileImageId",
                table: "Teams");

            migrationBuilder.DropIndex(
                name: "IX_Teams_ProfileImageId",
                table: "Teams");

            migrationBuilder.DropColumn(
                name: "ProfileImageId",
                table: "Teams");

            migrationBuilder.AddColumn<byte[]>(
                name: "Avatar",
                table: "Teams",
                type: "varbinary(max)",
                nullable: false,
                defaultValue: new byte[0]);
        }
    }
}
