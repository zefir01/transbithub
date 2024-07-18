using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

namespace Backend.Migrations
{
    public partial class marketing1 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ym_ids",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    created_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    yandex_id = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_ym_ids", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "ym_ids_connection",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    ym_id_id = table.Column<long>(type: "bigint", nullable: true),
                    user_id = table.Column<long>(type: "bigint", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_ym_ids_connection", x => x.id);
                    table.ForeignKey(
                        name: "fk_ym_ids_connection_user_datas_user_id",
                        column: x => x.user_id,
                        principalTable: "user_datas",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_ym_ids_connection_ym_ids_ym_id_id",
                        column: x => x.ym_id_id,
                        principalTable: "ym_ids",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "ix_ym_ids_connection_user_id",
                table: "ym_ids_connection",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "ix_ym_ids_connection_ym_id_id",
                table: "ym_ids_connection",
                column: "ym_id_id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ym_ids_connection");

            migrationBuilder.DropTable(
                name: "ym_ids");
        }
    }
}
