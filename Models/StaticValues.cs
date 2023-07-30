using GalleryFound.Infra;

namespace GalleryFound.Models;

/// <summary>
/// サーバー等から取得したデータの保持
/// </summary>
public static class StaticValues
{
    public static Author[] Authors { get; } = Factories.GetAuthors();
}
