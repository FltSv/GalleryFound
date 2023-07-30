namespace GalleryFound.Models;

/// <summary>
/// 作品の1つを示す
/// </summary>
public record class Product
{
    /// <summary>
    /// 作品名
    /// </summary>
    public string Name { get; set; }

    /// <summary>
    /// 作品のサムネイル画像
    /// </summary>
    public Uri Image { get; set; }

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
    public Author Author { get; set; }

    /// <summary>
    /// 通販情報
    /// </summary>
    public List<ShopUriPair> ShopUriPairs { get; } = new();
}
