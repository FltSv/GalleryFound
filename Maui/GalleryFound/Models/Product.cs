namespace GalleryFound.Models;

/// <summary>
/// 作品の1つを示す
/// </summary>
public record class Product
{
    public string Id { get; init; }

    /// <summary>
    /// 作品名
    /// </summary>
    public string Name { get; init; }

    /// <summary>
    /// 作品のサムネイル画像
    /// </summary>
    public string Image { get; init; }

    /// <summary>
    /// 公開日時
    /// </summary>
    public DateTime ReleaseDate { get; set; }

    /// <summary>
    /// 表示用の日時
    /// </summary>
    public string DisplayDate => $"{ReleaseDate.ToString("yyyy/M")}頃";

    /// <summary>
    /// ギャラリー情報
    /// </summary>
    public Gallery Gallery { get; set; }

    /// <summary>
    /// 作家情報
    /// </summary>
    public Creator Creator { get; set; }

    /// <summary>
    /// 通販情報
    /// </summary>
    public List<ShopUri> ShopUriPairs { get; } = new();
}
