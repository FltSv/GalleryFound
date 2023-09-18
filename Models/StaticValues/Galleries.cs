using GalleryFound.Infra;

namespace GalleryFound.Models.StaticValues;

public class Galleries : StaticValueBase<Gallery>
{
    public static Galleries Instance { get; private set; } = new();

    private Galleries() { }

    public override async Task LoadValuesAsync()
    {
        //todo
        var repo = await Factories.GetRepo();
        //SetCollection(await repo.GetCreatorsAsync());
    }
}
