using GalleryFound.Models.Repositories;

namespace GalleryFound.Models.StaticValues;

public class Galleries : StaticValueBase<Gallery>
{
    public static Galleries Instance { get; private set; } = new();

    private Galleries() { }

    public override async Task LoadValuesAsync(IRepo repo) => 
        SetCollection(await repo.GetGalleriesAsync());
}
