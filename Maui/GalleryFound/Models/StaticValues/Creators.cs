using GalleryFound.Models.Repositories;

namespace GalleryFound.Models.StaticValues;

public sealed class Creators : StaticValueBase<Creator>
{
    public static Creators Instance { get; private set; } = new();

    private Creators() { }

    public override async Task LoadValuesAsync(IRepo repo) => 
        SetCollection(await repo.GetCreatorsAsync());
}
