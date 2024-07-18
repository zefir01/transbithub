using Microsoft.EntityFrameworkCore.Migrations;

namespace Backend.Migrations
{
    public partial class lnAd1 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "ln_disable_balance",
                table: "deals",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "ln_enabled",
                table: "deals",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "ln_disable_balance",
                table: "advertisements",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "ln_enabled",
                table: "advertisements",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ln_disable_balance",
                table: "deals");

            migrationBuilder.DropColumn(
                name: "ln_enabled",
                table: "deals");

            migrationBuilder.DropColumn(
                name: "ln_disable_balance",
                table: "advertisements");

            migrationBuilder.DropColumn(
                name: "ln_enabled",
                table: "advertisements");
        }
    }
}
