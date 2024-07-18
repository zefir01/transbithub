using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

namespace Backend.Migrations
{
    public partial class fix1 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "avg_prices",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    fiat_currency = table.Column<int>(type: "integer", nullable: false),
                    value = table.Column<decimal>(type: "numeric", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_avg_prices", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "btc_core_wallets",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    instance_url = table.Column<string>(type: "text", nullable: true),
                    fee = table.Column<decimal>(type: "numeric", nullable: false),
                    last_block = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    balance = table.Column<decimal>(type: "numeric", nullable: false),
                    unconfirmed_balance = table.Column<decimal>(type: "numeric", nullable: false),
                    max_transactions_time = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    xmin = table.Column<uint>(type: "xid", rowVersion: true, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_btc_core_wallets", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "complaints",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    text = table.Column<string>(type: "text", nullable: true),
                    from_contact = table.Column<string>(type: "text", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    status = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_complaints", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "crypto_exchange_variables",
                columns: table => new
                {
                    key = table.Column<int>(type: "integer", nullable: false),
                    value = table.Column<decimal>(type: "numeric", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_crypto_exchange_variables", x => x.key);
                });

            migrationBuilder.CreateTable(
                name: "fiat_exchange_variables",
                columns: table => new
                {
                    key = table.Column<int>(type: "integer", nullable: false),
                    value = table.Column<decimal>(type: "numeric", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_fiat_exchange_variables", x => x.key);
                });

            migrationBuilder.CreateTable(
                name: "ip_countries",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    from = table.Column<long>(type: "bigint", nullable: false),
                    to = table.Column<long>(type: "bigint", nullable: false),
                    country = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_ip_countries", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "user_datas",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    invoices_data_invoice_created_count = table.Column<int>(type: "integer", nullable: true),
                    invoices_data_payments_payed_sum_amount = table.Column<decimal>(type: "numeric", nullable: true),
                    invoices_data_payments_payed_count = table.Column<int>(type: "integer", nullable: true),
                    invoices_data_payments_received_count = table.Column<int>(type: "integer", nullable: true),
                    invoices_data_payments_received_sum_amount = table.Column<decimal>(type: "numeric", nullable: true),
                    invoices_data_positive_feedbacks = table.Column<int>(type: "integer", nullable: true),
                    invoices_data_negative_feedbacks = table.Column<int>(type: "integer", nullable: true),
                    deals_data_avg_amount = table.Column<decimal>(type: "numeric", nullable: true),
                    deals_data_count = table.Column<long>(type: "bigint", nullable: true),
                    deals_data_partners_count = table.Column<long>(type: "bigint", nullable: true),
                    deals_data_response_rate = table.Column<decimal>(type: "numeric", nullable: true),
                    deals_data_deal_date = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    deals_data_avg_delay_seconds = table.Column<long>(type: "bigint", nullable: true),
                    deals_data_median_delay_seconds = table.Column<long>(type: "bigint", nullable: true),
                    user_id = table.Column<string>(type: "text", nullable: true),
                    user_name = table.Column<string>(type: "text", nullable: true),
                    trusted_count = table.Column<long>(type: "bigint", nullable: false),
                    blocked_count = table.Column<long>(type: "bigint", nullable: false),
                    time_zone = table.Column<string>(type: "text", nullable: true),
                    introduction = table.Column<string>(type: "text", nullable: true),
                    site = table.Column<string>(type: "text", nullable: true),
                    sales_disabled = table.Column<bool>(type: "boolean", nullable: false),
                    buys_disabled = table.Column<bool>(type: "boolean", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    jira_creds_username = table.Column<string>(type: "text", nullable: true),
                    jira_creds_key = table.Column<string>(type: "text", nullable: true),
                    jira_creds_password = table.Column<string>(type: "text", nullable: true),
                    is_deleted = table.Column<bool>(type: "boolean", nullable: false),
                    default_currency = table.Column<int>(type: "integer", nullable: false),
                    options_auto_price = table.Column<int>(type: "integer", nullable: true),
                    is_anonymous = table.Column<bool>(type: "boolean", nullable: false),
                    last_ad_search_sell_country = table.Column<int>(type: "integer", nullable: true),
                    last_ad_search_sell_currency = table.Column<int>(type: "integer", nullable: true),
                    last_ad_search_sell_payment_type = table.Column<int>(type: "integer", nullable: true),
                    last_ad_search_sell_amount = table.Column<decimal>(type: "numeric", nullable: true),
                    last_ad_search_buy_country = table.Column<int>(type: "integer", nullable: true),
                    last_ad_search_buy_currency = table.Column<int>(type: "integer", nullable: true),
                    last_ad_search_buy_payment_type = table.Column<int>(type: "integer", nullable: true),
                    last_ad_search_buy_amount = table.Column<decimal>(type: "numeric", nullable: true),
                    xmin = table.Column<uint>(type: "xid", rowVersion: true, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_user_datas", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "variables_metadata",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    updated_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_variables_metadata", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "advertisements",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    auto_price_delay = table.Column<int>(type: "integer", nullable: true),
                    equation = table.Column<string>(type: "text", nullable: true),
                    min_amount = table.Column<decimal>(type: "numeric", nullable: false),
                    max_amount = table.Column<decimal>(type: "numeric", nullable: false),
                    message = table.Column<string>(type: "text", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    country = table.Column<int>(type: "integer", nullable: false),
                    payment_type = table.Column<int>(type: "integer", nullable: false),
                    fiat_currency = table.Column<int>(type: "integer", nullable: false),
                    is_buy = table.Column<bool>(type: "boolean", nullable: false),
                    owner_id = table.Column<long>(type: "bigint", nullable: false),
                    monitor_liquidity = table.Column<bool>(type: "boolean", nullable: false),
                    not_anonymous = table.Column<bool>(type: "boolean", nullable: false),
                    trusted = table.Column<bool>(type: "boolean", nullable: false),
                    title = table.Column<string>(type: "text", nullable: true),
                    window = table.Column<long>(type: "bigint", nullable: false),
                    is_enabled = table.Column<bool>(type: "boolean", nullable: false),
                    metadata_status = table.Column<int>(type: "integer", nullable: true),
                    metadata_max_amount = table.Column<decimal>(type: "numeric", nullable: true),
                    metadata_price = table.Column<decimal>(type: "numeric", nullable: true),
                    metadata_min_crypto_amount = table.Column<decimal>(type: "numeric", nullable: true),
                    metadata_max_crypto_amount = table.Column<decimal>(type: "numeric", nullable: true),
                    metadata_auto_price_update_time = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    xmin = table.Column<uint>(type: "xid", rowVersion: true, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_advertisements", x => x.id);
                    table.ForeignKey(
                        name: "fk_advertisements_user_datas_owner_id",
                        column: x => x.owner_id,
                        principalTable: "user_datas",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "blocked_user",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    owner_id = table.Column<long>(type: "bigint", nullable: false),
                    user_id = table.Column<long>(type: "bigint", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_blocked_user", x => x.id);
                    table.ForeignKey(
                        name: "fk_blocked_user_user_datas_owner_id",
                        column: x => x.owner_id,
                        principalTable: "user_datas",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_blocked_user_user_datas_user_id",
                        column: x => x.user_id,
                        principalTable: "user_datas",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "feedbacks",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    from_id = table.Column<long>(type: "bigint", nullable: true),
                    to_id = table.Column<long>(type: "bigint", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    is_positive = table.Column<bool>(type: "boolean", nullable: false),
                    text = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_feedbacks", x => x.id);
                    table.ForeignKey(
                        name: "fk_feedbacks_user_datas_from_id",
                        column: x => x.from_id,
                        principalTable: "user_datas",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_feedbacks_user_datas_to_id",
                        column: x => x.to_id,
                        principalTable: "user_datas",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "in_address",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    address = table.Column<string>(type: "text", nullable: true),
                    btc_core_wallet_id = table.Column<long>(type: "bigint", nullable: true),
                    owner_id = table.Column<long>(type: "bigint", nullable: false),
                    is_bech32 = table.Column<bool>(type: "boolean", nullable: false),
                    xmin = table.Column<uint>(type: "xid", rowVersion: true, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_in_address", x => x.id);
                    table.ForeignKey(
                        name: "fk_in_address_btc_core_wallets_btc_core_wallet_id",
                        column: x => x.btc_core_wallet_id,
                        principalTable: "btc_core_wallets",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_in_address_user_datas_owner_id",
                        column: x => x.owner_id,
                        principalTable: "user_datas",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "invoice_payment_feedback",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    message = table.Column<string>(type: "text", nullable: true),
                    is_positive = table.Column<bool>(type: "boolean", nullable: false),
                    owner_id = table.Column<long>(type: "bigint", nullable: true),
                    xmin = table.Column<uint>(type: "xid", rowVersion: true, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_invoice_payment_feedback", x => x.id);
                    table.ForeignKey(
                        name: "fk_invoice_payment_feedback_user_datas_owner_id",
                        column: x => x.owner_id,
                        principalTable: "user_datas",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "invoice_snapshot",
                columns: table => new
                {
                    key = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    id = table.Column<long>(type: "bigint", nullable: false),
                    is_private = table.Column<bool>(type: "boolean", nullable: false),
                    is_base_crypto = table.Column<bool>(type: "boolean", nullable: false),
                    price = table.Column<decimal>(type: "numeric", nullable: false),
                    current_crypto_price = table.Column<decimal>(type: "numeric", nullable: false),
                    fiat_currency = table.Column<int>(type: "integer", nullable: false),
                    price_variable = table.Column<string>(type: "text", nullable: true),
                    ttl_minutes = table.Column<int>(type: "integer", nullable: false),
                    comment = table.Column<string>(type: "text", nullable: true),
                    pieces_min = table.Column<int>(type: "integer", nullable: false),
                    pieces_max = table.Column<int>(type: "integer", nullable: false),
                    target_user_id = table.Column<long>(type: "bigint", nullable: true),
                    owner_id = table.Column<long>(type: "bigint", nullable: true),
                    status = table.Column<int>(type: "integer", nullable: false),
                    total_payed_crypto = table.Column<decimal>(type: "numeric", nullable: false),
                    payments_count = table.Column<int>(type: "integer", nullable: false),
                    expire_time = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    deleted_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    fee = table.Column<decimal>(type: "numeric", nullable: false),
                    target_deleted = table.Column<bool>(type: "boolean", nullable: false),
                    limit_liquidity = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_invoice_snapshot", x => x.key);
                    table.ForeignKey(
                        name: "fk_invoice_snapshot_user_datas_owner_id",
                        column: x => x.owner_id,
                        principalTable: "user_datas",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_invoice_snapshot_user_datas_target_user_id",
                        column: x => x.target_user_id,
                        principalTable: "user_datas",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "lnpayment",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    owner_id = table.Column<long>(type: "bigint", nullable: false),
                    amount = table.Column<decimal>(type: "numeric", nullable: false),
                    description = table.Column<string>(type: "text", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    bolt11 = table.Column<string>(type: "text", nullable: false),
                    fee = table.Column<decimal>(type: "numeric", nullable: false),
                    xmin = table.Column<uint>(type: "xid", rowVersion: true, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_lnpayment", x => x.id);
                    table.ForeignKey(
                        name: "fk_lnpayment_user_datas_owner_id",
                        column: x => x.owner_id,
                        principalTable: "user_datas",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "out_transaction_requests",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    amount = table.Column<decimal>(type: "numeric", nullable: false),
                    fee = table.Column<decimal>(type: "numeric", nullable: false),
                    address = table.Column<string>(type: "text", nullable: true),
                    owner_id = table.Column<long>(type: "bigint", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    is_started = table.Column<bool>(type: "boolean", nullable: false),
                    subtract_fee_from_amount = table.Column<bool>(type: "boolean", nullable: false),
                    btc_core_wallet_id = table.Column<long>(type: "bigint", nullable: true),
                    xmin = table.Column<uint>(type: "xid", rowVersion: true, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_out_transaction_requests", x => x.id);
                    table.ForeignKey(
                        name: "fk_out_transaction_requests_btc_core_wallets_btc_core_wallet_id",
                        column: x => x.btc_core_wallet_id,
                        principalTable: "btc_core_wallets",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_out_transaction_requests_user_datas_owner_id",
                        column: x => x.owner_id,
                        principalTable: "user_datas",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "trusted_user",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    owner_id = table.Column<long>(type: "bigint", nullable: false),
                    user_id = table.Column<long>(type: "bigint", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_trusted_user", x => x.id);
                    table.ForeignKey(
                        name: "fk_trusted_user_user_datas_owner_id",
                        column: x => x.owner_id,
                        principalTable: "user_datas",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_trusted_user_user_datas_user_id",
                        column: x => x.user_id,
                        principalTable: "user_datas",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "user_balance",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    owner_fk = table.Column<long>(type: "bigint", nullable: true),
                    balance = table.Column<decimal>(type: "numeric", nullable: false),
                    unconfirmed_balance = table.Column<decimal>(type: "numeric", nullable: false),
                    deposited = table.Column<decimal>(type: "numeric", nullable: false),
                    xmin = table.Column<uint>(type: "xid", rowVersion: true, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_user_balance", x => x.id);
                    table.ForeignKey(
                        name: "fk_user_balance_user_datas_owner_fk",
                        column: x => x.owner_fk,
                        principalTable: "user_datas",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "user_last_online",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    owner_fk = table.Column<long>(type: "bigint", nullable: true),
                    last_online = table.Column<DateTime>(type: "timestamp without time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_user_last_online", x => x.id);
                    table.ForeignKey(
                        name: "fk_user_last_online_user_datas_owner_fk",
                        column: x => x.owner_fk,
                        principalTable: "user_datas",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "time_table_item",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    day = table.Column<int>(type: "integer", nullable: false),
                    start = table.Column<byte>(type: "smallint", nullable: false),
                    end = table.Column<byte>(type: "smallint", nullable: false),
                    advertisement_id = table.Column<long>(type: "bigint", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_time_table_item", x => x.id);
                    table.ForeignKey(
                        name: "fk_time_table_item_advertisements_advertisement_id",
                        column: x => x.advertisement_id,
                        principalTable: "advertisements",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "in_transaction",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    tx_id = table.Column<string>(type: "text", nullable: true),
                    address_id = table.Column<long>(type: "bigint", nullable: false),
                    amount = table.Column<decimal>(type: "numeric", nullable: false),
                    confirmations = table.Column<int>(type: "integer", nullable: false),
                    time = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    xmin = table.Column<uint>(type: "xid", rowVersion: true, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_in_transaction", x => x.id);
                    table.ForeignKey(
                        name: "fk_in_transaction_in_address_address_id",
                        column: x => x.address_id,
                        principalTable: "in_address",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "out_transaction",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    tx_id = table.Column<string>(type: "text", nullable: true),
                    address = table.Column<string>(type: "text", nullable: true),
                    amount = table.Column<decimal>(type: "numeric", nullable: false),
                    confirmations = table.Column<int>(type: "integer", nullable: false),
                    time = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    fee = table.Column<decimal>(type: "numeric", nullable: false),
                    wallet_id = table.Column<long>(type: "bigint", nullable: true),
                    request_id = table.Column<long>(type: "bigint", nullable: true),
                    xmin = table.Column<uint>(type: "xid", rowVersion: true, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_out_transaction", x => x.id);
                    table.ForeignKey(
                        name: "fk_out_transaction_btc_core_wallets_wallet_id",
                        column: x => x.wallet_id,
                        principalTable: "btc_core_wallets",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_out_transaction_out_transaction_requests_request_id",
                        column: x => x.request_id,
                        principalTable: "out_transaction_requests",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "deals",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    fiat_amount = table.Column<decimal>(type: "numeric", nullable: false),
                    crypto_amount = table.Column<decimal>(type: "numeric", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    status = table.Column<int>(type: "integer", nullable: false),
                    completed_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    canceled_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    is_fiat_payed = table.Column<bool>(type: "boolean", nullable: false),
                    fiat_payed_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    ad_owner_feed_back_id = table.Column<long>(type: "bigint", nullable: true),
                    initiator_feed_back_id = table.Column<long>(type: "bigint", nullable: true),
                    ad_id = table.Column<long>(type: "bigint", nullable: true),
                    initiator_id = table.Column<long>(type: "bigint", nullable: true),
                    ad_owner_id = table.Column<long>(type: "bigint", nullable: true),
                    btc_wallet = table.Column<string>(type: "text", nullable: true),
                    fee = table.Column<decimal>(type: "numeric", nullable: false),
                    auto_cancel_time = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    invoice_payment_fk = table.Column<long>(type: "bigint", nullable: true),
                    xmin = table.Column<uint>(type: "xid", rowVersion: true, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_deals", x => x.id);
                    table.ForeignKey(
                        name: "fk_deals_advertisements_ad_id",
                        column: x => x.ad_id,
                        principalTable: "advertisements",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_deals_feedbacks_ad_owner_feed_back_id",
                        column: x => x.ad_owner_feed_back_id,
                        principalTable: "feedbacks",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_deals_feedbacks_initiator_feed_back_id",
                        column: x => x.initiator_feed_back_id,
                        principalTable: "feedbacks",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_deals_user_datas_ad_owner_id",
                        column: x => x.ad_owner_id,
                        principalTable: "user_datas",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_deals_user_datas_initiator_id",
                        column: x => x.initiator_id,
                        principalTable: "user_datas",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "deal_message",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    created_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    owner_id = table.Column<long>(type: "bigint", nullable: true),
                    text = table.Column<string>(type: "text", nullable: true),
                    deal_fk = table.Column<long>(type: "bigint", nullable: true),
                    deal_id = table.Column<long>(type: "bigint", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_deal_message", x => x.id);
                    table.ForeignKey(
                        name: "fk_deal_message_deals_deal_fk",
                        column: x => x.deal_fk,
                        principalTable: "deals",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_deal_message_deals_deal_id",
                        column: x => x.deal_id,
                        principalTable: "deals",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_deal_message_user_datas_owner_id",
                        column: x => x.owner_id,
                        principalTable: "user_datas",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "dispute",
                columns: table => new
                {
                    jira_issue_id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    created_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    deal_fk = table.Column<long>(type: "bigint", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_dispute", x => x.jira_issue_id);
                    table.ForeignKey(
                        name: "fk_dispute_deals_deal_fk",
                        column: x => x.deal_fk,
                        principalTable: "deals",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "conversation_message",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    owner_id = table.Column<long>(type: "bigint", nullable: true),
                    text = table.Column<string>(type: "text", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    conversation_id = table.Column<long>(type: "bigint", nullable: true),
                    xmin = table.Column<uint>(type: "xid", rowVersion: true, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_conversation_message", x => x.id);
                    table.ForeignKey(
                        name: "fk_conversation_message_user_datas_owner_id",
                        column: x => x.owner_id,
                        principalTable: "user_datas",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "user_event",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    source = table.Column<int>(type: "integer", nullable: false),
                    creater_id = table.Column<long>(type: "bigint", nullable: true),
                    receiver_id = table.Column<long>(type: "bigint", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    type = table.Column<int>(type: "integer", nullable: false),
                    deal_id = table.Column<long>(type: "bigint", nullable: true),
                    deal_message_id = table.Column<long>(type: "bigint", nullable: true),
                    invoice_id = table.Column<long>(type: "bigint", nullable: true),
                    invoice_payment_id = table.Column<long>(type: "bigint", nullable: true),
                    conversation_id = table.Column<long>(type: "bigint", nullable: true),
                    image_id = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_user_event", x => x.id);
                    table.ForeignKey(
                        name: "fk_user_event_deal_message_deal_message_id",
                        column: x => x.deal_message_id,
                        principalTable: "deal_message",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_user_event_deals_deal_id",
                        column: x => x.deal_id,
                        principalTable: "deals",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_user_event_user_datas_creater_id",
                        column: x => x.creater_id,
                        principalTable: "user_datas",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_user_event_user_datas_receiver_id",
                        column: x => x.receiver_id,
                        principalTable: "user_datas",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "images",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    owner_fk = table.Column<long>(type: "bigint", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    is_empty = table.Column<bool>(type: "boolean", nullable: false),
                    deal_message_fk = table.Column<long>(type: "bigint", nullable: true),
                    conversation_message_id = table.Column<long>(type: "bigint", nullable: true),
                    jira_id = table.Column<long>(type: "bigint", nullable: false),
                    jira_file_name = table.Column<string>(type: "text", nullable: true),
                    invoice_fk = table.Column<long>(type: "bigint", nullable: true),
                    invoice_secret_fk = table.Column<long>(type: "bigint", nullable: true),
                    order = table.Column<int>(type: "integer", nullable: false),
                    preview = table.Column<byte[]>(type: "bytea", nullable: true),
                    original = table.Column<byte[]>(type: "bytea", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_images", x => x.id);
                    table.ForeignKey(
                        name: "fk_images_conversation_message_conversation_message_id",
                        column: x => x.conversation_message_id,
                        principalTable: "conversation_message",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_images_deal_message_deal_message_fk",
                        column: x => x.deal_message_fk,
                        principalTable: "deal_message",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_images_user_datas_owner_fk",
                        column: x => x.owner_fk,
                        principalTable: "user_datas",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "promises",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    amount = table.Column<decimal>(type: "numeric", nullable: false),
                    password = table.Column<string>(type: "text", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    creator_id = table.Column<long>(type: "bigint", nullable: true),
                    deal_locked_fk = table.Column<long>(type: "bigint", nullable: true),
                    locked = table.Column<bool>(type: "boolean", nullable: false),
                    payment_fk = table.Column<long>(type: "bigint", nullable: true),
                    invoice_payment_id = table.Column<long>(type: "bigint", nullable: true),
                    xmin = table.Column<uint>(type: "xid", rowVersion: true, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_promises", x => x.id);
                    table.ForeignKey(
                        name: "fk_promises_deals_deal_locked_fk",
                        column: x => x.deal_locked_fk,
                        principalTable: "deals",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_promises_user_datas_creator_id",
                        column: x => x.creator_id,
                        principalTable: "user_datas",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "conversation",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    seller_deleted = table.Column<bool>(type: "boolean", nullable: false),
                    buyer_deleted = table.Column<bool>(type: "boolean", nullable: false),
                    buyer_id = table.Column<long>(type: "bigint", nullable: true),
                    seller_id = table.Column<long>(type: "bigint", nullable: true),
                    invoice_fk = table.Column<long>(type: "bigint", nullable: true),
                    payment_fk = table.Column<long>(type: "bigint", nullable: true),
                    xmin = table.Column<uint>(type: "xid", rowVersion: true, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_conversation", x => x.id);
                    table.ForeignKey(
                        name: "fk_conversation_user_datas_buyer_id",
                        column: x => x.buyer_id,
                        principalTable: "user_datas",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_conversation_user_datas_seller_id",
                        column: x => x.seller_id,
                        principalTable: "user_datas",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "invoice_secret",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    invoice_fk = table.Column<long>(type: "bigint", nullable: false),
                    payment_id = table.Column<long>(type: "bigint", nullable: true),
                    text = table.Column<string>(type: "text", nullable: false),
                    url = table.Column<string>(type: "text", nullable: true),
                    order = table.Column<int>(type: "integer", nullable: false),
                    xmin = table.Column<uint>(type: "xid", rowVersion: true, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_invoice_secret", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "invoices",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    is_service = table.Column<int>(type: "integer", nullable: false),
                    refund_id = table.Column<long>(type: "bigint", nullable: true),
                    is_private = table.Column<bool>(type: "boolean", nullable: false),
                    is_base_crypto = table.Column<bool>(type: "boolean", nullable: false),
                    price = table.Column<decimal>(type: "numeric", nullable: false),
                    current_crypto_price = table.Column<decimal>(type: "numeric", nullable: false),
                    fiat_currency = table.Column<int>(type: "integer", nullable: false),
                    price_variable = table.Column<string>(type: "text", nullable: true),
                    ttl_minutes = table.Column<int>(type: "integer", nullable: false),
                    comment = table.Column<string>(type: "text", nullable: true),
                    pieces_min = table.Column<int>(type: "integer", nullable: false),
                    pieces_max = table.Column<int>(type: "integer", nullable: false),
                    target_user_id = table.Column<long>(type: "bigint", nullable: true),
                    owner_fk = table.Column<long>(type: "bigint", nullable: false),
                    status = table.Column<int>(type: "integer", nullable: false),
                    total_payed_crypto = table.Column<decimal>(type: "numeric", nullable: false),
                    payments_count = table.Column<int>(type: "integer", nullable: false),
                    expire_time = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    deleted_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    fee = table.Column<decimal>(type: "numeric", nullable: false),
                    target_deleted = table.Column<bool>(type: "boolean", nullable: false),
                    limit_liquidity = table.Column<bool>(type: "boolean", nullable: false),
                    xmin = table.Column<uint>(type: "xid", rowVersion: true, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_invoices", x => x.id);
                    table.ForeignKey(
                        name: "fk_invoices_user_datas_owner_fk",
                        column: x => x.owner_fk,
                        principalTable: "user_datas",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_invoices_user_datas_target_user_id",
                        column: x => x.target_user_id,
                        principalTable: "user_datas",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "invoice_integration",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    type = table.Column<int>(type: "integer", nullable: false),
                    redirect = table.Column<string>(type: "text", nullable: true),
                    webhook_url = table.Column<string>(type: "text", nullable: true),
                    webhook_client_key = table.Column<string>(type: "text", nullable: true),
                    webhook_client_cert = table.Column<string>(type: "text", nullable: true),
                    webhook_server_cert = table.Column<string>(type: "text", nullable: true),
                    webhook_required = table.Column<bool>(type: "boolean", nullable: true),
                    invoice_fk = table.Column<long>(type: "bigint", nullable: true),
                    xmin = table.Column<uint>(type: "xid", rowVersion: true, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_invoice_integration", x => x.id);
                    table.ForeignKey(
                        name: "fk_invoice_integration_invoices_invoice_fk",
                        column: x => x.invoice_fk,
                        principalTable: "invoices",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "invoice_payment",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    status = table.Column<int>(type: "integer", nullable: false),
                    invoice_fk = table.Column<long>(type: "bigint", nullable: true),
                    invoice_snapshot_key = table.Column<long>(type: "bigint", nullable: true),
                    pieces = table.Column<int>(type: "integer", nullable: false),
                    crypto_amount = table.Column<decimal>(type: "numeric", nullable: false),
                    fee = table.Column<decimal>(type: "numeric", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    owner_fk = table.Column<long>(type: "bigint", nullable: true),
                    owner_feedback_id = table.Column<long>(type: "bigint", nullable: true),
                    seller_feedback_id = table.Column<long>(type: "bigint", nullable: true),
                    refunded = table.Column<int>(type: "integer", nullable: false),
                    refunding = table.Column<int>(type: "integer", nullable: false),
                    is_refund = table.Column<bool>(type: "boolean", nullable: false),
                    xmin = table.Column<uint>(type: "xid", rowVersion: true, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_invoice_payment", x => x.id);
                    table.ForeignKey(
                        name: "fk_invoice_payment_invoice_payment_feedback_owner_feedback_id",
                        column: x => x.owner_feedback_id,
                        principalTable: "invoice_payment_feedback",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_invoice_payment_invoice_payment_feedback_seller_feedback_id",
                        column: x => x.seller_feedback_id,
                        principalTable: "invoice_payment_feedback",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_invoice_payment_invoice_snapshot_invoice_snapshot_key",
                        column: x => x.invoice_snapshot_key,
                        principalTable: "invoice_snapshot",
                        principalColumn: "key",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_invoice_payment_invoices_invoice_fk",
                        column: x => x.invoice_fk,
                        principalTable: "invoices",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_invoice_payment_user_datas_owner_fk",
                        column: x => x.owner_fk,
                        principalTable: "user_datas",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "lninvoices",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    status = table.Column<int>(type: "integer", nullable: false),
                    amount = table.Column<decimal>(type: "numeric", nullable: false),
                    owner_id = table.Column<long>(type: "bigint", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    expires_in = table.Column<TimeSpan>(type: "interval", nullable: false),
                    description = table.Column<string>(type: "text", nullable: false),
                    error = table.Column<string>(type: "text", nullable: true),
                    is_processed = table.Column<bool>(type: "boolean", nullable: false),
                    bolt11 = table.Column<string>(type: "text", nullable: true),
                    payment_fk = table.Column<long>(type: "bigint", nullable: true),
                    xmin = table.Column<uint>(type: "xid", rowVersion: true, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_lninvoices", x => x.id);
                    table.ForeignKey(
                        name: "fk_lninvoices_invoice_payment_payment_fk",
                        column: x => x.payment_fk,
                        principalTable: "invoice_payment",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_lninvoices_user_datas_owner_id",
                        column: x => x.owner_id,
                        principalTable: "user_datas",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "ix_advertisements_auto_price_delay",
                table: "advertisements",
                column: "auto_price_delay");

            migrationBuilder.CreateIndex(
                name: "ix_advertisements_country",
                table: "advertisements",
                column: "country");

            migrationBuilder.CreateIndex(
                name: "ix_advertisements_fiat_currency",
                table: "advertisements",
                column: "fiat_currency");

            migrationBuilder.CreateIndex(
                name: "ix_advertisements_is_buy",
                table: "advertisements",
                column: "is_buy");

            migrationBuilder.CreateIndex(
                name: "ix_advertisements_is_enabled",
                table: "advertisements",
                column: "is_enabled");

            migrationBuilder.CreateIndex(
                name: "ix_advertisements_max_amount",
                table: "advertisements",
                column: "max_amount");

            migrationBuilder.CreateIndex(
                name: "ix_advertisements_metadata_auto_price_update_time",
                table: "advertisements",
                column: "metadata_auto_price_update_time");

            migrationBuilder.CreateIndex(
                name: "ix_advertisements_metadata_max_amount",
                table: "advertisements",
                column: "metadata_max_amount");

            migrationBuilder.CreateIndex(
                name: "ix_advertisements_metadata_max_crypto_amount",
                table: "advertisements",
                column: "metadata_max_crypto_amount");

            migrationBuilder.CreateIndex(
                name: "ix_advertisements_metadata_min_crypto_amount",
                table: "advertisements",
                column: "metadata_min_crypto_amount");

            migrationBuilder.CreateIndex(
                name: "ix_advertisements_metadata_price",
                table: "advertisements",
                column: "metadata_price");

            migrationBuilder.CreateIndex(
                name: "ix_advertisements_metadata_status",
                table: "advertisements",
                column: "metadata_status");

            migrationBuilder.CreateIndex(
                name: "ix_advertisements_min_amount",
                table: "advertisements",
                column: "min_amount");

            migrationBuilder.CreateIndex(
                name: "ix_advertisements_monitor_liquidity",
                table: "advertisements",
                column: "monitor_liquidity");

            migrationBuilder.CreateIndex(
                name: "ix_advertisements_not_anonymous",
                table: "advertisements",
                column: "not_anonymous");

            migrationBuilder.CreateIndex(
                name: "ix_advertisements_owner_id",
                table: "advertisements",
                column: "owner_id");

            migrationBuilder.CreateIndex(
                name: "ix_advertisements_payment_type",
                table: "advertisements",
                column: "payment_type");

            migrationBuilder.CreateIndex(
                name: "ix_advertisements_trusted",
                table: "advertisements",
                column: "trusted");

            migrationBuilder.CreateIndex(
                name: "ix_avg_prices_fiat_currency",
                table: "avg_prices",
                column: "fiat_currency");

            migrationBuilder.CreateIndex(
                name: "ix_blocked_user_owner_id",
                table: "blocked_user",
                column: "owner_id");

            migrationBuilder.CreateIndex(
                name: "ix_blocked_user_user_id",
                table: "blocked_user",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "ix_btc_core_wallets_instance_url",
                table: "btc_core_wallets",
                column: "instance_url");

            migrationBuilder.CreateIndex(
                name: "ix_conversation_buyer_id",
                table: "conversation",
                column: "buyer_id");

            migrationBuilder.CreateIndex(
                name: "ix_conversation_invoice_fk",
                table: "conversation",
                column: "invoice_fk");

            migrationBuilder.CreateIndex(
                name: "ix_conversation_payment_fk",
                table: "conversation",
                column: "payment_fk",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_conversation_seller_id",
                table: "conversation",
                column: "seller_id");

            migrationBuilder.CreateIndex(
                name: "ix_conversation_message_conversation_id",
                table: "conversation_message",
                column: "conversation_id");

            migrationBuilder.CreateIndex(
                name: "ix_conversation_message_owner_id",
                table: "conversation_message",
                column: "owner_id");

            migrationBuilder.CreateIndex(
                name: "ix_deal_message_deal_fk",
                table: "deal_message",
                column: "deal_fk");

            migrationBuilder.CreateIndex(
                name: "ix_deal_message_deal_id",
                table: "deal_message",
                column: "deal_id");

            migrationBuilder.CreateIndex(
                name: "ix_deal_message_owner_id",
                table: "deal_message",
                column: "owner_id");

            migrationBuilder.CreateIndex(
                name: "ix_deals_ad_id",
                table: "deals",
                column: "ad_id");

            migrationBuilder.CreateIndex(
                name: "ix_deals_ad_owner_feed_back_id",
                table: "deals",
                column: "ad_owner_feed_back_id");

            migrationBuilder.CreateIndex(
                name: "ix_deals_ad_owner_id",
                table: "deals",
                column: "ad_owner_id");

            migrationBuilder.CreateIndex(
                name: "ix_deals_initiator_feed_back_id",
                table: "deals",
                column: "initiator_feed_back_id");

            migrationBuilder.CreateIndex(
                name: "ix_deals_initiator_id",
                table: "deals",
                column: "initiator_id");

            migrationBuilder.CreateIndex(
                name: "ix_deals_invoice_payment_fk",
                table: "deals",
                column: "invoice_payment_fk",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_dispute_deal_fk",
                table: "dispute",
                column: "deal_fk",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_feedbacks_from_id",
                table: "feedbacks",
                column: "from_id");

            migrationBuilder.CreateIndex(
                name: "ix_feedbacks_to_id",
                table: "feedbacks",
                column: "to_id");

            migrationBuilder.CreateIndex(
                name: "ix_images_conversation_message_id",
                table: "images",
                column: "conversation_message_id");

            migrationBuilder.CreateIndex(
                name: "ix_images_deal_message_fk",
                table: "images",
                column: "deal_message_fk");

            migrationBuilder.CreateIndex(
                name: "ix_images_invoice_fk",
                table: "images",
                column: "invoice_fk");

            migrationBuilder.CreateIndex(
                name: "ix_images_invoice_secret_fk",
                table: "images",
                column: "invoice_secret_fk");

            migrationBuilder.CreateIndex(
                name: "ix_images_is_empty",
                table: "images",
                column: "is_empty");

            migrationBuilder.CreateIndex(
                name: "ix_images_jira_id",
                table: "images",
                column: "jira_id");

            migrationBuilder.CreateIndex(
                name: "ix_images_owner_fk",
                table: "images",
                column: "owner_fk");

            migrationBuilder.CreateIndex(
                name: "ix_in_address_btc_core_wallet_id",
                table: "in_address",
                column: "btc_core_wallet_id");

            migrationBuilder.CreateIndex(
                name: "ix_in_address_owner_id",
                table: "in_address",
                column: "owner_id");

            migrationBuilder.CreateIndex(
                name: "ix_in_transaction_address_id",
                table: "in_transaction",
                column: "address_id");

            migrationBuilder.CreateIndex(
                name: "ix_in_transaction_confirmations",
                table: "in_transaction",
                column: "confirmations");

            migrationBuilder.CreateIndex(
                name: "ix_in_transaction_tx_id",
                table: "in_transaction",
                column: "tx_id");

            migrationBuilder.CreateIndex(
                name: "ix_invoice_integration_invoice_fk",
                table: "invoice_integration",
                column: "invoice_fk",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_invoice_payment_invoice_fk",
                table: "invoice_payment",
                column: "invoice_fk");

            migrationBuilder.CreateIndex(
                name: "ix_invoice_payment_invoice_snapshot_key",
                table: "invoice_payment",
                column: "invoice_snapshot_key");

            migrationBuilder.CreateIndex(
                name: "ix_invoice_payment_owner_feedback_id",
                table: "invoice_payment",
                column: "owner_feedback_id");

            migrationBuilder.CreateIndex(
                name: "ix_invoice_payment_owner_fk",
                table: "invoice_payment",
                column: "owner_fk");

            migrationBuilder.CreateIndex(
                name: "ix_invoice_payment_seller_feedback_id",
                table: "invoice_payment",
                column: "seller_feedback_id");

            migrationBuilder.CreateIndex(
                name: "ix_invoice_payment_feedback_owner_id",
                table: "invoice_payment_feedback",
                column: "owner_id");

            migrationBuilder.CreateIndex(
                name: "ix_invoice_secret_invoice_fk",
                table: "invoice_secret",
                column: "invoice_fk");

            migrationBuilder.CreateIndex(
                name: "ix_invoice_secret_payment_id",
                table: "invoice_secret",
                column: "payment_id");

            migrationBuilder.CreateIndex(
                name: "ix_invoice_snapshot_expire_time",
                table: "invoice_snapshot",
                column: "expire_time");

            migrationBuilder.CreateIndex(
                name: "ix_invoice_snapshot_is_private",
                table: "invoice_snapshot",
                column: "is_private");

            migrationBuilder.CreateIndex(
                name: "ix_invoice_snapshot_owner_id",
                table: "invoice_snapshot",
                column: "owner_id");

            migrationBuilder.CreateIndex(
                name: "ix_invoice_snapshot_status",
                table: "invoice_snapshot",
                column: "status");

            migrationBuilder.CreateIndex(
                name: "ix_invoice_snapshot_target_user_id",
                table: "invoice_snapshot",
                column: "target_user_id");

            migrationBuilder.CreateIndex(
                name: "ix_invoice_snapshot_ttl_minutes",
                table: "invoice_snapshot",
                column: "ttl_minutes");

            migrationBuilder.CreateIndex(
                name: "ix_invoices_expire_time",
                table: "invoices",
                column: "expire_time");

            migrationBuilder.CreateIndex(
                name: "ix_invoices_is_private",
                table: "invoices",
                column: "is_private");

            migrationBuilder.CreateIndex(
                name: "ix_invoices_owner_fk",
                table: "invoices",
                column: "owner_fk");

            migrationBuilder.CreateIndex(
                name: "ix_invoices_refund_id",
                table: "invoices",
                column: "refund_id");

            migrationBuilder.CreateIndex(
                name: "ix_invoices_status",
                table: "invoices",
                column: "status");

            migrationBuilder.CreateIndex(
                name: "ix_invoices_target_user_id",
                table: "invoices",
                column: "target_user_id");

            migrationBuilder.CreateIndex(
                name: "ix_invoices_ttl_minutes",
                table: "invoices",
                column: "ttl_minutes");

            migrationBuilder.CreateIndex(
                name: "ix_ip_countries_from",
                table: "ip_countries",
                column: "from");

            migrationBuilder.CreateIndex(
                name: "ix_ip_countries_from_to",
                table: "ip_countries",
                columns: new[] { "from", "to" });

            migrationBuilder.CreateIndex(
                name: "ix_ip_countries_to",
                table: "ip_countries",
                column: "to");

            migrationBuilder.CreateIndex(
                name: "ix_lninvoices_owner_id",
                table: "lninvoices",
                column: "owner_id");

            migrationBuilder.CreateIndex(
                name: "ix_lninvoices_payment_fk",
                table: "lninvoices",
                column: "payment_fk",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_lninvoices_status",
                table: "lninvoices",
                column: "status");

            migrationBuilder.CreateIndex(
                name: "ix_lnpayment_owner_id",
                table: "lnpayment",
                column: "owner_id");

            migrationBuilder.CreateIndex(
                name: "ix_out_transaction_confirmations",
                table: "out_transaction",
                column: "confirmations");

            migrationBuilder.CreateIndex(
                name: "ix_out_transaction_request_id",
                table: "out_transaction",
                column: "request_id",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_out_transaction_tx_id",
                table: "out_transaction",
                column: "tx_id");

            migrationBuilder.CreateIndex(
                name: "ix_out_transaction_wallet_id",
                table: "out_transaction",
                column: "wallet_id");

            migrationBuilder.CreateIndex(
                name: "ix_out_transaction_requests_btc_core_wallet_id",
                table: "out_transaction_requests",
                column: "btc_core_wallet_id");

            migrationBuilder.CreateIndex(
                name: "ix_out_transaction_requests_owner_id",
                table: "out_transaction_requests",
                column: "owner_id");

            migrationBuilder.CreateIndex(
                name: "ix_promises_creator_id",
                table: "promises",
                column: "creator_id");

            migrationBuilder.CreateIndex(
                name: "ix_promises_deal_locked_fk",
                table: "promises",
                column: "deal_locked_fk",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_promises_invoice_payment_id",
                table: "promises",
                column: "invoice_payment_id",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_promises_payment_fk",
                table: "promises",
                column: "payment_fk");

            migrationBuilder.CreateIndex(
                name: "ix_time_table_item_advertisement_id",
                table: "time_table_item",
                column: "advertisement_id");

            migrationBuilder.CreateIndex(
                name: "ix_time_table_item_day",
                table: "time_table_item",
                column: "day");

            migrationBuilder.CreateIndex(
                name: "ix_time_table_item_end",
                table: "time_table_item",
                column: "end");

            migrationBuilder.CreateIndex(
                name: "ix_time_table_item_start",
                table: "time_table_item",
                column: "start");

            migrationBuilder.CreateIndex(
                name: "ix_trusted_user_owner_id",
                table: "trusted_user",
                column: "owner_id");

            migrationBuilder.CreateIndex(
                name: "ix_trusted_user_user_id",
                table: "trusted_user",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "ix_user_balance_owner_fk",
                table: "user_balance",
                column: "owner_fk",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_user_datas_jira_creds_key",
                table: "user_datas",
                column: "jira_creds_key");

            migrationBuilder.CreateIndex(
                name: "ix_user_datas_user_id",
                table: "user_datas",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "ix_user_datas_user_name",
                table: "user_datas",
                column: "user_name");

            migrationBuilder.CreateIndex(
                name: "ix_user_event_conversation_id",
                table: "user_event",
                column: "conversation_id");

            migrationBuilder.CreateIndex(
                name: "ix_user_event_creater_id",
                table: "user_event",
                column: "creater_id");

            migrationBuilder.CreateIndex(
                name: "ix_user_event_deal_id",
                table: "user_event",
                column: "deal_id");

            migrationBuilder.CreateIndex(
                name: "ix_user_event_deal_message_id",
                table: "user_event",
                column: "deal_message_id");

            migrationBuilder.CreateIndex(
                name: "ix_user_event_invoice_id",
                table: "user_event",
                column: "invoice_id");

            migrationBuilder.CreateIndex(
                name: "ix_user_event_invoice_payment_id",
                table: "user_event",
                column: "invoice_payment_id");

            migrationBuilder.CreateIndex(
                name: "ix_user_event_receiver_id",
                table: "user_event",
                column: "receiver_id");

            migrationBuilder.CreateIndex(
                name: "ix_user_last_online_owner_fk",
                table: "user_last_online",
                column: "owner_fk",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "fk_deals_invoice_payment_invoice_payment_fk",
                table: "deals",
                column: "invoice_payment_fk",
                principalTable: "invoice_payment",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "fk_conversation_message_conversation_conversation_id",
                table: "conversation_message",
                column: "conversation_id",
                principalTable: "conversation",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "fk_user_event_conversation_conversation_id",
                table: "user_event",
                column: "conversation_id",
                principalTable: "conversation",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "fk_user_event_invoice_payment_invoice_payment_id",
                table: "user_event",
                column: "invoice_payment_id",
                principalTable: "invoice_payment",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "fk_user_event_invoices_invoice_id",
                table: "user_event",
                column: "invoice_id",
                principalTable: "invoices",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "fk_images_invoice_secret_invoice_secret_fk",
                table: "images",
                column: "invoice_secret_fk",
                principalTable: "invoice_secret",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "fk_images_invoices_invoice_fk",
                table: "images",
                column: "invoice_fk",
                principalTable: "invoices",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "fk_promises_invoice_payment_invoice_payment_id",
                table: "promises",
                column: "invoice_payment_id",
                principalTable: "invoice_payment",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "fk_promises_invoice_payment_payment_fk",
                table: "promises",
                column: "payment_fk",
                principalTable: "invoice_payment",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "fk_conversation_invoice_payment_payment_fk",
                table: "conversation",
                column: "payment_fk",
                principalTable: "invoice_payment",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "fk_conversation_invoices_invoice_fk",
                table: "conversation",
                column: "invoice_fk",
                principalTable: "invoices",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "fk_invoice_secret_invoice_payment_payment_id",
                table: "invoice_secret",
                column: "payment_id",
                principalTable: "invoice_payment",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "fk_invoice_secret_invoices_invoice_fk",
                table: "invoice_secret",
                column: "invoice_fk",
                principalTable: "invoices",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "fk_invoices_invoice_payment_refund_id",
                table: "invoices",
                column: "refund_id",
                principalTable: "invoice_payment",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_invoice_payment_user_datas_owner_fk",
                table: "invoice_payment");

            migrationBuilder.DropForeignKey(
                name: "fk_invoice_payment_feedback_user_datas_owner_id",
                table: "invoice_payment_feedback");

            migrationBuilder.DropForeignKey(
                name: "fk_invoice_snapshot_user_datas_owner_id",
                table: "invoice_snapshot");

            migrationBuilder.DropForeignKey(
                name: "fk_invoice_snapshot_user_datas_target_user_id",
                table: "invoice_snapshot");

            migrationBuilder.DropForeignKey(
                name: "fk_invoices_user_datas_owner_fk",
                table: "invoices");

            migrationBuilder.DropForeignKey(
                name: "fk_invoices_user_datas_target_user_id",
                table: "invoices");

            migrationBuilder.DropForeignKey(
                name: "fk_invoices_invoice_payment_refund_id",
                table: "invoices");

            migrationBuilder.DropTable(
                name: "avg_prices");

            migrationBuilder.DropTable(
                name: "blocked_user");

            migrationBuilder.DropTable(
                name: "complaints");

            migrationBuilder.DropTable(
                name: "crypto_exchange_variables");

            migrationBuilder.DropTable(
                name: "dispute");

            migrationBuilder.DropTable(
                name: "fiat_exchange_variables");

            migrationBuilder.DropTable(
                name: "images");

            migrationBuilder.DropTable(
                name: "in_transaction");

            migrationBuilder.DropTable(
                name: "invoice_integration");

            migrationBuilder.DropTable(
                name: "ip_countries");

            migrationBuilder.DropTable(
                name: "lninvoices");

            migrationBuilder.DropTable(
                name: "lnpayment");

            migrationBuilder.DropTable(
                name: "out_transaction");

            migrationBuilder.DropTable(
                name: "promises");

            migrationBuilder.DropTable(
                name: "time_table_item");

            migrationBuilder.DropTable(
                name: "trusted_user");

            migrationBuilder.DropTable(
                name: "user_balance");

            migrationBuilder.DropTable(
                name: "user_event");

            migrationBuilder.DropTable(
                name: "user_last_online");

            migrationBuilder.DropTable(
                name: "variables_metadata");

            migrationBuilder.DropTable(
                name: "conversation_message");

            migrationBuilder.DropTable(
                name: "invoice_secret");

            migrationBuilder.DropTable(
                name: "in_address");

            migrationBuilder.DropTable(
                name: "out_transaction_requests");

            migrationBuilder.DropTable(
                name: "deal_message");

            migrationBuilder.DropTable(
                name: "conversation");

            migrationBuilder.DropTable(
                name: "btc_core_wallets");

            migrationBuilder.DropTable(
                name: "deals");

            migrationBuilder.DropTable(
                name: "advertisements");

            migrationBuilder.DropTable(
                name: "feedbacks");

            migrationBuilder.DropTable(
                name: "user_datas");

            migrationBuilder.DropTable(
                name: "invoice_payment");

            migrationBuilder.DropTable(
                name: "invoice_payment_feedback");

            migrationBuilder.DropTable(
                name: "invoice_snapshot");

            migrationBuilder.DropTable(
                name: "invoices");
        }
    }
}
