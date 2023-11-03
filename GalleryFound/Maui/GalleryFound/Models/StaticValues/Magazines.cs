using GalleryFound.Models.Repositories;

namespace GalleryFound.Models.StaticValues;

public class Magazines : StaticValueBase<Magazine>
{
    public static Magazines Instance { get; private set; } = new();

    private Magazines() { }

    public override async Task LoadValuesAsync(IRepo repo) => 
        SetCollection(await repo.GetMagazinesAsync());
}
