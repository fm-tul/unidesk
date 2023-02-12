using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Unidesk.Migrations
{
    /// <inheritdoc />
    public partial class AddEvaluatorName : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ThesisEvaluations_Users_UserId",
                table: "ThesisEvaluations");

            migrationBuilder.RenameColumn(
                name: "UserId",
                table: "ThesisEvaluations",
                newName: "EvaluatorId");

            migrationBuilder.RenameIndex(
                name: "IX_ThesisEvaluations_UserId",
                table: "ThesisEvaluations",
                newName: "IX_ThesisEvaluations_EvaluatorId");

            migrationBuilder.AddColumn<string>(
                name: "EvaluatorFullName",
                table: "ThesisEvaluations",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddForeignKey(
                name: "FK_ThesisEvaluations_Users_EvaluatorId",
                table: "ThesisEvaluations",
                column: "EvaluatorId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ThesisEvaluations_Users_EvaluatorId",
                table: "ThesisEvaluations");

            migrationBuilder.DropColumn(
                name: "EvaluatorFullName",
                table: "ThesisEvaluations");

            migrationBuilder.RenameColumn(
                name: "EvaluatorId",
                table: "ThesisEvaluations",
                newName: "UserId");

            migrationBuilder.RenameIndex(
                name: "IX_ThesisEvaluations_EvaluatorId",
                table: "ThesisEvaluations",
                newName: "IX_ThesisEvaluations_UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_ThesisEvaluations_Users_UserId",
                table: "ThesisEvaluations",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
