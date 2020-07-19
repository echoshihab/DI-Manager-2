using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Persistence.Migrations
{
    public partial class adUserstoDb : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "ModalityId",
                table: "AspNetUsers",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUsers_ModalityId",
                table: "AspNetUsers",
                column: "ModalityId");

            migrationBuilder.AddForeignKey(
                name: "FK_AspNetUsers_Modalities_ModalityId",
                table: "AspNetUsers",
                column: "ModalityId",
                principalTable: "Modalities",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AspNetUsers_Modalities_ModalityId",
                table: "AspNetUsers");

            migrationBuilder.DropIndex(
                name: "IX_AspNetUsers_ModalityId",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "ModalityId",
                table: "AspNetUsers");
        }
    }
}
