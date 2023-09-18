using GalleryFound.Infra;

namespace GalleryFound.Models.StaticValues;

public class Magazines : StaticValueBase<object>//todo
{
    public static Magazines Instance { get; private set; } = new();

    private Magazines() { }

    public override async Task LoadValuesAsync()
    {
        //todo
        var repo = await Factories.GetRepo();
        //SetCollection(await repo.GetCreatorsAsync());
    }
}
