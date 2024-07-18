using Microsoft.EntityFrameworkCore.Migrations;

namespace Backend.Migrations
{
    public partial class support2 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_disputes_user_datas_arbitor_id",
                table: "disputes");

            migrationBuilder.RenameColumn(
                name: "arbitor_id",
                table: "disputes",
                newName: "arbitor_fk");

            migrationBuilder.RenameColumn(
                name: "jira_issue_id",
                table: "disputes",
                newName: "id");

            migrationBuilder.RenameIndex(
                name: "ix_disputes_arbitor_id",
                table: "disputes",
                newName: "ix_disputes_arbitor_fk");

            migrationBuilder.AddForeignKey(
                name: "fk_disputes_user_datas_arbitor_fk",
                table: "disputes",
                column: "arbitor_fk",
                principalTable: "user_datas",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_disputes_user_datas_arbitor_fk",
                table: "disputes");

            migrationBuilder.RenameColumn(
                name: "arbitor_fk",
                table: "disputes",
                newName: "arbitor_id");

            migrationBuilder.RenameColumn(
                name: "id",
                table: "disputes",
                newName: "jira_issue_id");

            migrationBuilder.RenameIndex(
                name: "ix_disputes_arbitor_fk",
                table: "disputes",
                newName: "ix_disputes_arbitor_id");

            migrationBuilder.AddForeignKey(
                name: "fk_disputes_user_datas_arbitor_id",
                table: "disputes",
                column: "arbitor_id",
                principalTable: "user_datas",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
