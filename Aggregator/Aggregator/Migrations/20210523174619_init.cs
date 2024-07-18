using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

namespace Aggregator.Migrations
{
    public partial class init : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "bz_params",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    last_full_update = table.Column<DateTime>(type: "timestamp without time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_bz_params", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "trader",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    name = table.Column<string>(type: "text", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    last_activity = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    registered_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    source_type = table.Column<int>(type: "integer", nullable: false),
                    verified = table.Column<bool>(type: "boolean", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_trader", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "ad",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    ad_id = table.Column<long>(type: "bigint", nullable: false),
                    country = table.Column<int>(type: "integer", nullable: true),
                    is_buy = table.Column<bool>(type: "boolean", nullable: false),
                    payment_type = table.Column<int>(type: "integer", nullable: false),
                    fiat_currency = table.Column<int>(type: "integer", nullable: false),
                    min_amount = table.Column<decimal>(type: "numeric", nullable: false),
                    max_amount = table.Column<decimal>(type: "numeric", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    owner_id = table.Column<long>(type: "bigint", nullable: false),
                    disabled_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    price = table.Column<decimal>(type: "numeric", nullable: false),
                    terms = table.Column<string>(type: "text", nullable: false),
                    city = table.Column<string>(type: "text", nullable: true),
                    updated_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    price_updated_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    window = table.Column<int>(type: "integer", nullable: true),
                    crypto_currency = table.Column<int>(type: "integer", nullable: false),
                    source_type = table.Column<int>(type: "integer", nullable: false),
                    bank_name = table.Column<string>(type: "text", nullable: true),
                    require_feedback_score = table.Column<decimal>(type: "numeric", nullable: true),
                    require_trade_volume = table.Column<decimal>(type: "numeric", nullable: true),
                    px_ad_id = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_ad", x => x.id);
                    table.ForeignKey(
                        name: "fk_ad_trader_owner_id",
                        column: x => x.owner_id,
                        principalTable: "trader",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "trader_snapshot",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    trades_count = table.Column<int>(type: "integer", nullable: false),
                    rating = table.Column<decimal>(type: "numeric", nullable: false),
                    positive_feedbacks = table.Column<int>(type: "integer", nullable: false),
                    negative_feedbacks = table.Column<int>(type: "integer", nullable: false),
                    completed_deals = table.Column<int>(type: "integer", nullable: false),
                    canceled_deals = table.Column<int>(type: "integer", nullable: false),
                    trusted_count = table.Column<int>(type: "integer", nullable: false),
                    blocked_count = table.Column<int>(type: "integer", nullable: false),
                    amount = table.Column<decimal>(type: "numeric", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    owner_id = table.Column<long>(type: "bigint", nullable: false),
                    source_type = table.Column<int>(type: "integer", nullable: false),
                    dispute_loose = table.Column<int>(type: "integer", nullable: true),
                    partners = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_trader_snapshot", x => x.id);
                    table.ForeignKey(
                        name: "fk_trader_snapshot_trader_owner_id",
                        column: x => x.owner_id,
                        principalTable: "trader",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "bz_trader_volumes",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    crypto_currency = table.Column<int>(type: "integer", nullable: false),
                    amount = table.Column<decimal>(type: "numeric", nullable: false),
                    deals_count = table.Column<long>(type: "bigint", nullable: false),
                    snapshot_id = table.Column<long>(type: "bigint", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_bz_trader_volumes", x => x.id);
                    table.ForeignKey(
                        name: "fk_bz_trader_volumes_trader_snapshot_snapshot_id",
                        column: x => x.snapshot_id,
                        principalTable: "trader_snapshot",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "ix_ad_ad_id",
                table: "ad",
                column: "ad_id");

            migrationBuilder.CreateIndex(
                name: "ix_ad_owner_id",
                table: "ad",
                column: "owner_id");

            migrationBuilder.CreateIndex(
                name: "ix_bz_trader_volumes_snapshot_id",
                table: "bz_trader_volumes",
                column: "snapshot_id");

            migrationBuilder.CreateIndex(
                name: "ix_trader_snapshot_owner_id",
                table: "trader_snapshot",
                column: "owner_id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ad");

            migrationBuilder.DropTable(
                name: "bz_params");

            migrationBuilder.DropTable(
                name: "bz_trader_volumes");

            migrationBuilder.DropTable(
                name: "trader_snapshot");

            migrationBuilder.DropTable(
                name: "trader");
        }
    }
}
