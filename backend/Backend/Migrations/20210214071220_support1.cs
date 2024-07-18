using Microsoft.EntityFrameworkCore.Migrations;

namespace Backend.Migrations
{
    public partial class support1 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "is_support",
                table: "user_datas",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "is_support",
                table: "user_datas");
        }
    }
}
