using GalleryFound.Infra;

namespace GalleryFound.Models;

/// <summary>
/// サーバー等から取得したデータの保持
/// </summary>
public static class StaticValues
{
    public static bool IsLoaded { get; private set; }

    public static Author[] Authors { get; private set; }

    public static async void LoadValues()
    {
        var repo = await Factories.GetRepo();
        Authors = await repo.GetAuthorsAsync();

        IsLoaded = true;
    }
}
