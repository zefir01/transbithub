using Microsoft.EntityFrameworkCore.Migrations;

namespace Backend.Migrations
{
    public partial class rmjira : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "ix_user_datas_jira_creds_key",
                table: "user_datas");

            migrationBuilder.DropIndex(
                name: "ix_images_jira_id",
                table: "images");

            migrationBuilder.DropColumn(
                name: "jira_creds_key",
                table: "user_datas");

            migrationBuilder.DropColumn(
                name: "jira_creds_password",
                table: "user_datas");

            migrationBuilder.DropColumn(
                name: "jira_creds_username",
                table: "user_datas");

            migrationBuilder.DropColumn(
                name: "jira_file_name",
                table: "images");

            migrationBuilder.DropColumn(
                name: "jira_id",
                table: "images");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "jira_creds_key",
                table: "user_datas",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "jira_creds_password",
                table: "user_datas",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "jira_creds_username",
                table: "user_datas",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "jira_file_name",
                table: "images",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<long>(
                name: "jira_id",
                table: "images",
                type: "bigint",
                nullable: false,
                defaultValue: 0L);

            migrationBuilder.CreateIndex(
                name: "ix_user_datas_jira_creds_key",
                table: "user_datas",
                column: "jira_creds_key");

            migrationBuilder.CreateIndex(
                name: "ix_images_jira_id",
                table: "images",
                column: "jira_id");
        }
    }
}
