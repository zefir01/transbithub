using Microsoft.EntityFrameworkCore.Migrations;

namespace Backend.Migrations
{
    public partial class marketing2 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_ym_ids_connection_user_datas_user_id",
                table: "ym_ids_connection");

            migrationBuilder.DropForeignKey(
                name: "fk_ym_ids_connection_ym_ids_ym_id_id",
                table: "ym_ids_connection");

            migrationBuilder.DropPrimaryKey(
                name: "pk_ym_ids_connection",
                table: "ym_ids_connection");

            migrationBuilder.RenameTable(
                name: "ym_ids_connection",
                newName: "ym_ids_connections");

            migrationBuilder.RenameIndex(
                name: "ix_ym_ids_connection_ym_id_id",
                table: "ym_ids_connections",
                newName: "ix_ym_ids_connections_ym_id_id");

            migrationBuilder.RenameIndex(
                name: "ix_ym_ids_connection_user_id",
                table: "ym_ids_connections",
                newName: "ix_ym_ids_connections_user_id");

            migrationBuilder.AddPrimaryKey(
                name: "pk_ym_ids_connections",
                table: "ym_ids_connections",
                column: "id");

            migrationBuilder.AddForeignKey(
                name: "fk_ym_ids_connections_user_datas_user_id",
                table: "ym_ids_connections",
                column: "user_id",
                principalTable: "user_datas",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "fk_ym_ids_connections_ym_ids_ym_id_id",
                table: "ym_ids_connections",
                column: "ym_id_id",
                principalTable: "ym_ids",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_ym_ids_connections_user_datas_user_id",
                table: "ym_ids_connections");

            migrationBuilder.DropForeignKey(
                name: "fk_ym_ids_connections_ym_ids_ym_id_id",
                table: "ym_ids_connections");

            migrationBuilder.DropPrimaryKey(
                name: "pk_ym_ids_connections",
                table: "ym_ids_connections");

            migrationBuilder.RenameTable(
                name: "ym_ids_connections",
                newName: "ym_ids_connection");

            migrationBuilder.RenameIndex(
                name: "ix_ym_ids_connections_ym_id_id",
                table: "ym_ids_connection",
                newName: "ix_ym_ids_connection_ym_id_id");

            migrationBuilder.RenameIndex(
                name: "ix_ym_ids_connections_user_id",
                table: "ym_ids_connection",
                newName: "ix_ym_ids_connection_user_id");

            migrationBuilder.AddPrimaryKey(
                name: "pk_ym_ids_connection",
                table: "ym_ids_connection",
                column: "id");

            migrationBuilder.AddForeignKey(
                name: "fk_ym_ids_connection_user_datas_user_id",
                table: "ym_ids_connection",
                column: "user_id",
                principalTable: "user_datas",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "fk_ym_ids_connection_ym_ids_ym_id_id",
                table: "ym_ids_connection",
                column: "ym_id_id",
                principalTable: "ym_ids",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
