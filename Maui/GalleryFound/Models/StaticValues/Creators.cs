using GalleryFound.Models.Repositories;

namespace GalleryFound.Models.StaticValues;

public sealed class Creators : StaticValueBase<Creator>
{
    public static Creators Instance { get; private set; } = new();

    private Creators() { }

    public override async Task LoadValuesAsync(IRepo repo) => 
        SetCollection(await repo.GetCreatorsAsync());

    /// <summary>
    /// 全作家の作品一覧を取得
    /// </summary>
    public static IEnumerable<Product> GetAllCreatorsProducts() =>
        Instance.SelectMany(x => x.Products);
}
