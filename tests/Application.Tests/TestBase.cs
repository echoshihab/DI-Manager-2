
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Tests
{
    public class TestBase
    {
        public ApplicationDbContext GetDbContext()
        {
            var builder = new DbContextOptionsBuilder<ApplicationDbContext>();

            builder.UseSqlite("Data Source=:memory:", x => { });

            var dbContext = new ApplicationDbContext(builder.Options);

            dbContext.Database.OpenConnection();

            dbContext.Database.EnsureCreated();

            return dbContext;
        }
    }
}