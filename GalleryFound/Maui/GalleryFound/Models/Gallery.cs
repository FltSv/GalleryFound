namespace GalleryFound.Models;

public record class Gallery
{
    /// <summary>
    /// ギャラリー名
    /// </summary>
    public string Name { get; init; }

    /// <summary>
    /// ギャラリーの場所
    /// </summary>
    public Uri Location { get; init; }
}
