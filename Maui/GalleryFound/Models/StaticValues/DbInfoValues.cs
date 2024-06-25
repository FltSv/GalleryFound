using GalleryFound.Models.Repositories;

namespace GalleryFound.Models.StaticValues;

public record class DbInfoValues : DbInfo
{
    public static DbInfoValues Instance { get; private set; } = new();

    private DbInfoValues() { }

    private DbInfoValues(DbInfo data) : base(data) { }

    internal async Task LoadValueAsync(IRepo repo)
    {
        Instance = new(await repo.GetDbInfoAsync());
    }
}
