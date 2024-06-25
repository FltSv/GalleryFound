namespace GalleryFound.Models;

public record class Gallery
{
    public string Id { get; init; }

    /// <summary>
    /// ギャラリー名
    /// </summary>
    public string Name { get; init; }

    /// <summary>
    /// ギャラリーの場所
    /// </summary>
    public string Location { get; init; }
}
