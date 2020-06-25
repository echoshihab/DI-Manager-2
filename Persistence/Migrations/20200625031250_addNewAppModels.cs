using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Persistence.Migrations
{
    public partial class addNewAppModels : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "License",
                table: "Shifts");

            migrationBuilder.DropColumn(
                name: "Location",
                table: "Shifts");

            migrationBuilder.DropColumn(
                name: "Modality",
                table: "Shifts");

            migrationBuilder.DropColumn(
                name: "Room",
                table: "Shifts");

            migrationBuilder.DropColumn(
                name: "Technologist",
                table: "Shifts");

            migrationBuilder.AddColumn<Guid>(
                name: "LicenseId",
                table: "Shifts",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<Guid>(
                name: "LocationId",
                table: "Shifts",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<Guid>(
                name: "ModalityId",
                table: "Shifts",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<Guid>(
                name: "RoomId",
                table: "Shifts",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<Guid>(
                name: "TechnologistId",
                table: "Shifts",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateTable(
                name: "Modalities",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    Name = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Modalities", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Licenses",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    Name = table.Column<string>(nullable: true),
                    DisplayName = table.Column<string>(nullable: true),
                    ModalityId = table.Column<Guid>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Licenses", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Licenses_Modalities_ModalityId",
                        column: x => x.ModalityId,
                        principalTable: "Modalities",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Technologists",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    Name = table.Column<string>(nullable: true),
                    Initial = table.Column<string>(nullable: true),
                    ModalityId = table.Column<Guid>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Technologists", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Technologists_Modalities_ModalityId",
                        column: x => x.ModalityId,
                        principalTable: "Modalities",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TechnologistLicenses",
                columns: table => new
                {
                    TechnologistId = table.Column<Guid>(nullable: false),
                    LicenseId = table.Column<Guid>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TechnologistLicenses", x => new { x.TechnologistId, x.LicenseId });
                    table.ForeignKey(
                        name: "FK_TechnologistLicenses_Licenses_LicenseId",
                        column: x => x.LicenseId,
                        principalTable: "Licenses",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_TechnologistLicenses_Technologists_TechnologistId",
                        column: x => x.TechnologistId,
                        principalTable: "Technologists",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Shifts_LicenseId",
                table: "Shifts",
                column: "LicenseId");

            migrationBuilder.CreateIndex(
                name: "IX_Shifts_LocationId",
                table: "Shifts",
                column: "LocationId");

            migrationBuilder.CreateIndex(
                name: "IX_Shifts_ModalityId",
                table: "Shifts",
                column: "ModalityId");

            migrationBuilder.CreateIndex(
                name: "IX_Shifts_RoomId",
                table: "Shifts",
                column: "RoomId");

            migrationBuilder.CreateIndex(
                name: "IX_Shifts_TechnologistId",
                table: "Shifts",
                column: "TechnologistId");

            migrationBuilder.CreateIndex(
                name: "IX_Licenses_ModalityId",
                table: "Licenses",
                column: "ModalityId");

            migrationBuilder.CreateIndex(
                name: "IX_TechnologistLicenses_LicenseId",
                table: "TechnologistLicenses",
                column: "LicenseId");

            migrationBuilder.CreateIndex(
                name: "IX_Technologists_ModalityId",
                table: "Technologists",
                column: "ModalityId");

            migrationBuilder.AddForeignKey(
                name: "FK_Shifts_Licenses_LicenseId",
                table: "Shifts",
                column: "LicenseId",
                principalTable: "Licenses",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Shifts_Locations_LocationId",
                table: "Shifts",
                column: "LocationId",
                principalTable: "Locations",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Shifts_Modalities_ModalityId",
                table: "Shifts",
                column: "ModalityId",
                principalTable: "Modalities",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Shifts_Rooms_RoomId",
                table: "Shifts",
                column: "RoomId",
                principalTable: "Rooms",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Shifts_Technologists_TechnologistId",
                table: "Shifts",
                column: "TechnologistId",
                principalTable: "Technologists",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Shifts_Licenses_LicenseId",
                table: "Shifts");

            migrationBuilder.DropForeignKey(
                name: "FK_Shifts_Locations_LocationId",
                table: "Shifts");

            migrationBuilder.DropForeignKey(
                name: "FK_Shifts_Modalities_ModalityId",
                table: "Shifts");

            migrationBuilder.DropForeignKey(
                name: "FK_Shifts_Rooms_RoomId",
                table: "Shifts");

            migrationBuilder.DropForeignKey(
                name: "FK_Shifts_Technologists_TechnologistId",
                table: "Shifts");

            migrationBuilder.DropTable(
                name: "TechnologistLicenses");

            migrationBuilder.DropTable(
                name: "Licenses");

            migrationBuilder.DropTable(
                name: "Technologists");

            migrationBuilder.DropTable(
                name: "Modalities");

            migrationBuilder.DropIndex(
                name: "IX_Shifts_LicenseId",
                table: "Shifts");

            migrationBuilder.DropIndex(
                name: "IX_Shifts_LocationId",
                table: "Shifts");

            migrationBuilder.DropIndex(
                name: "IX_Shifts_ModalityId",
                table: "Shifts");

            migrationBuilder.DropIndex(
                name: "IX_Shifts_RoomId",
                table: "Shifts");

            migrationBuilder.DropIndex(
                name: "IX_Shifts_TechnologistId",
                table: "Shifts");

            migrationBuilder.DropColumn(
                name: "LicenseId",
                table: "Shifts");

            migrationBuilder.DropColumn(
                name: "LocationId",
                table: "Shifts");

            migrationBuilder.DropColumn(
                name: "ModalityId",
                table: "Shifts");

            migrationBuilder.DropColumn(
                name: "RoomId",
                table: "Shifts");

            migrationBuilder.DropColumn(
                name: "TechnologistId",
                table: "Shifts");

            migrationBuilder.AddColumn<string>(
                name: "License",
                table: "Shifts",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Location",
                table: "Shifts",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Modality",
                table: "Shifts",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Room",
                table: "Shifts",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Technologist",
                table: "Shifts",
                type: "TEXT",
                nullable: true);
        }
    }
}
