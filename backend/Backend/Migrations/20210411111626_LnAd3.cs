using Microsoft.EntityFrameworkCore.Migrations;

namespace Backend.Migrations
{
    public partial class LnAd3 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "ln_enabled",
                table: "advertisements",
                newName: "ln_funding");

            migrationBuilder.AddColumn<string>(
                name: "bolt11",
                table: "deals",
                type: "text",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "bolt11",
                table: "deals");

            migrationBuilder.RenameColumn(
                name: "ln_funding",
                table: "advertisements",
                newName: "ln_enabled");
        }
    }
}
