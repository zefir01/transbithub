using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Backend.Migrations
{
    public partial class feedbacks : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "created_at",
                table: "invoice_payment_feedback",
                type: "timestamp without time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<long>(
                name: "to_id",
                table: "invoice_payment_feedback",
                type: "bigint",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "ix_invoice_payment_feedback_to_id",
                table: "invoice_payment_feedback",
                column: "to_id");

            migrationBuilder.AddForeignKey(
                name: "fk_invoice_payment_feedback_user_datas_to_id",
                table: "invoice_payment_feedback",
                column: "to_id",
                principalTable: "user_datas",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_invoice_payment_feedback_user_datas_to_id",
                table: "invoice_payment_feedback");

            migrationBuilder.DropIndex(
                name: "ix_invoice_payment_feedback_to_id",
                table: "invoice_payment_feedback");

            migrationBuilder.DropColumn(
                name: "created_at",
                table: "invoice_payment_feedback");

            migrationBuilder.DropColumn(
                name: "to_id",
                table: "invoice_payment_feedback");
        }
    }
}
