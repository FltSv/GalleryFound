namespace GalleryFound.Models;

public class Magazine
{
    /// <summary>
    /// 書籍名
    /// </summary>
    public string Name { get; set; }

    /// <summary>
    /// 作家
    /// </summary>
    public string Author { get; set; }

    /// <summary>
    /// 表紙画像
    /// </summary>
    public Uri Image { get; set; }

    /// <summary>
    /// 通販情報
    /// </summary>
    public List<ShopUri> Shops { get; } = new();
}
