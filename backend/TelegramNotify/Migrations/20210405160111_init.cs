using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

namespace TelegramNotify.Migrations
{
    public partial class init : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "telegram_images",
                columns: table => new
                {
                    image_id = table.Column<Guid>(type: "uuid", nullable: false),
                    telegram_file_id = table.Column<string>(type: "text", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_telegram_images", x => x.image_id);
                });

            migrationBuilder.CreateTable(
                name: "telegram_states",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    telegram_user_id = table.Column<int>(type: "integer", nullable: false),
                    data = table.Column<string>(type: "text", nullable: true),
                    anonymous_user_id = table.Column<string>(type: "text", nullable: true),
                    login_user_id = table.Column<string>(type: "text", nullable: true),
                    last_messages = table.Column<List<int>>(type: "integer[]", nullable: true),
                    lang = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_telegram_states", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "waiting_image",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    state_id = table.Column<long>(type: "bigint", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_waiting_image", x => x.id);
                    table.ForeignKey(
                        name: "fk_waiting_image_telegram_states_state_id",
                        column: x => x.state_id,
                        principalTable: "telegram_states",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "ix_telegram_images_telegram_file_id",
                table: "telegram_images",
                column: "telegram_file_id");

            migrationBuilder.CreateIndex(
                name: "ix_telegram_states_anonymous_user_id",
                table: "telegram_states",
                column: "anonymous_user_id");

            migrationBuilder.CreateIndex(
                name: "ix_telegram_states_login_user_id",
                table: "telegram_states",
                column: "login_user_id");

            migrationBuilder.CreateIndex(
                name: "ix_telegram_states_telegram_user_id",
                table: "telegram_states",
                column: "telegram_user_id");

            migrationBuilder.CreateIndex(
                name: "ix_waiting_image_state_id",
                table: "waiting_image",
                column: "state_id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "telegram_images");

            migrationBuilder.DropTable(
                name: "waiting_image");

            migrationBuilder.DropTable(
                name: "telegram_states");
        }
    }
}
