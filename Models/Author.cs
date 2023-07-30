namespace GalleryFound.Models;

public record class Author
{
    /// <summary>
    /// 作家名
    /// </summary>
    public string Name { get; init; }

    /// <summary>
    /// 作品一覧
    /// </summary>
    public List<Product> Products { get; } = new();

    /// <summary>
    /// 展示歴を取得
    /// </summary>
    public void GetPresentedHistory()
    {
        throw new NotImplementedException();
    }

    /// <summary>
    /// 発表作品を取得
    /// </summary>
    public void GetPresentedProducts()
    {
        throw new NotImplementedException();
    }
}
