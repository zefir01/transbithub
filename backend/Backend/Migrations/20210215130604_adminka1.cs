using Microsoft.EntityFrameworkCore.Migrations;

namespace Backend.Migrations
{
    public partial class adminka1 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_dispute_deals_deal_fk",
                table: "dispute");

            migrationBuilder.DropPrimaryKey(
                name: "pk_dispute",
                table: "dispute");

            migrationBuilder.RenameTable(
                name: "dispute",
                newName: "disputes");

            migrationBuilder.RenameIndex(
                name: "ix_dispute_deal_fk",
                table: "disputes",
                newName: "ix_disputes_deal_fk");

            migrationBuilder.AddColumn<long>(
                name: "arbitor_id",
                table: "disputes",
                type: "bigint",
                nullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "pk_disputes",
                table: "disputes",
                column: "jira_issue_id");

            migrationBuilder.CreateIndex(
                name: "ix_disputes_arbitor_id",
                table: "disputes",
                column: "arbitor_id");

            migrationBuilder.AddForeignKey(
                name: "fk_disputes_deals_deal_fk",
                table: "disputes",
                column: "deal_fk",
                principalTable: "deals",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "fk_disputes_user_datas_arbitor_id",
                table: "disputes",
                column: "arbitor_id",
                principalTable: "user_datas",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_disputes_deals_deal_fk",
                table: "disputes");

            migrationBuilder.DropForeignKey(
                name: "fk_disputes_user_datas_arbitor_id",
                table: "disputes");

            migrationBuilder.DropPrimaryKey(
                name: "pk_disputes",
                table: "disputes");

            migrationBuilder.DropIndex(
                name: "ix_disputes_arbitor_id",
                table: "disputes");

            migrationBuilder.DropColumn(
                name: "arbitor_id",
                table: "disputes");

            migrationBuilder.RenameTable(
                name: "disputes",
                newName: "dispute");

            migrationBuilder.RenameIndex(
                name: "ix_disputes_deal_fk",
                table: "dispute",
                newName: "ix_dispute_deal_fk");

            migrationBuilder.AddPrimaryKey(
                name: "pk_dispute",
                table: "dispute",
                column: "jira_issue_id");

            migrationBuilder.AddForeignKey(
                name: "fk_dispute_deals_deal_fk",
                table: "dispute",
                column: "deal_fk",
                principalTable: "deals",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
