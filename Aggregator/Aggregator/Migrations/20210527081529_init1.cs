using Microsoft.EntityFrameworkCore.Migrations;

namespace Aggregator.Migrations
{
    public partial class init1 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_trader_snapshot_source_type",
                table: "trader_snapshot",
                column: "source_type");

            migrationBuilder.CreateIndex(
                name: "ix_trader_name",
                table: "trader",
                column: "name");

            migrationBuilder.CreateIndex(
                name: "IX_trader_source_type",
                table: "trader",
                column: "source_type");

            migrationBuilder.CreateIndex(
                name: "ix_ad_crypto_currency",
                table: "ad",
                column: "crypto_currency");

            migrationBuilder.CreateIndex(
                name: "ix_ad_disabled_at",
                table: "ad",
                column: "disabled_at");

            migrationBuilder.CreateIndex(
                name: "ix_ad_fiat_currency",
                table: "ad",
                column: "fiat_currency");

            migrationBuilder.CreateIndex(
                name: "ix_ad_is_buy",
                table: "ad",
                column: "is_buy");

            migrationBuilder.CreateIndex(
                name: "ix_ad_max_amount",
                table: "ad",
                column: "max_amount");

            migrationBuilder.CreateIndex(
                name: "ix_ad_min_amount",
                table: "ad",
                column: "min_amount");

            migrationBuilder.CreateIndex(
                name: "ix_ad_payment_type",
                table: "ad",
                column: "payment_type");

            migrationBuilder.CreateIndex(
                name: "ix_ad_price",
                table: "ad",
                column: "price");

            migrationBuilder.CreateIndex(
                name: "ix_ad_price_updated_at",
                table: "ad",
                column: "price_updated_at");

            migrationBuilder.CreateIndex(
                name: "ix_ad_px_ad_id",
                table: "ad",
                column: "px_ad_id");

            migrationBuilder.CreateIndex(
                name: "IX_ad_source_type",
                table: "ad",
                column: "source_type");

            migrationBuilder.CreateIndex(
                name: "ix_ad_updated_at",
                table: "ad",
                column: "updated_at");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_trader_snapshot_source_type",
                table: "trader_snapshot");

            migrationBuilder.DropIndex(
                name: "ix_trader_name",
                table: "trader");

            migrationBuilder.DropIndex(
                name: "IX_trader_source_type",
                table: "trader");

            migrationBuilder.DropIndex(
                name: "ix_ad_crypto_currency",
                table: "ad");

            migrationBuilder.DropIndex(
                name: "ix_ad_disabled_at",
                table: "ad");

            migrationBuilder.DropIndex(
                name: "ix_ad_fiat_currency",
                table: "ad");

            migrationBuilder.DropIndex(
                name: "ix_ad_is_buy",
                table: "ad");

            migrationBuilder.DropIndex(
                name: "ix_ad_max_amount",
                table: "ad");

            migrationBuilder.DropIndex(
                name: "ix_ad_min_amount",
                table: "ad");

            migrationBuilder.DropIndex(
                name: "ix_ad_payment_type",
                table: "ad");

            migrationBuilder.DropIndex(
                name: "ix_ad_price",
                table: "ad");

            migrationBuilder.DropIndex(
                name: "ix_ad_price_updated_at",
                table: "ad");

            migrationBuilder.DropIndex(
                name: "ix_ad_px_ad_id",
                table: "ad");

            migrationBuilder.DropIndex(
                name: "IX_ad_source_type",
                table: "ad");

            migrationBuilder.DropIndex(
                name: "ix_ad_updated_at",
                table: "ad");
        }
    }
}
