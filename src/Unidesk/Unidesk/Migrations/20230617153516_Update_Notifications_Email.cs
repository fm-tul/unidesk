using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Unidesk.Migrations
{
    /// <inheritdoc />
    public partial class UpdateNotificationsEmail : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "EmailMessageId",
                table: "Notifications",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Notifications_EmailMessageId",
                table: "Notifications",
                column: "EmailMessageId");

            migrationBuilder.AddForeignKey(
                name: "FK_Notifications_Emails_EmailMessageId",
                table: "Notifications",
                column: "EmailMessageId",
                principalTable: "Emails",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Notifications_Emails_EmailMessageId",
                table: "Notifications");

            migrationBuilder.DropIndex(
                name: "IX_Notifications_EmailMessageId",
                table: "Notifications");

            migrationBuilder.DropColumn(
                name: "EmailMessageId",
                table: "Notifications");
        }
    }
}
