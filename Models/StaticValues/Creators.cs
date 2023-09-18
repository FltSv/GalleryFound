using GalleryFound.Infra;

namespace GalleryFound.Models.StaticValues;

public sealed class Creators : StaticValueBase<Creator>
{
    public static Creators Instance { get; private set; } = new();

    private Creators() { }

    public override async Task LoadValuesAsync()
    {
        var repo = await Factories.GetRepo();
        SetCollection(await repo.GetCreatorsAsync());
    }
}
