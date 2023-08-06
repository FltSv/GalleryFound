using GalleryFound.Helpers;

namespace GalleryFound.Models;

public record class Author
{
    private static readonly char[] _spaceDelimiters = new[] { ' ', '　' };

    /// <summary>
    /// 作家名
    /// </summary>
    public string Name { get; init; }

    /// <summary>
    /// 読み仮名
    /// </summary>
    public string Reading
    {
        get => _reading ?? Name;
        init => _reading = value;
    }
    private string _reading;

    /// <summary>
    /// 頭文字
    /// </summary>
    public string Initial => Reading.Substring(0, 1);

    /// <summary>
    /// 文字列がNameやReadingフィールドの中に全て含まれているかどうかをチェックします。
    /// 文字列は半角および全角スペースで区切られ、すべての単語がフィールド内に存在する場合のみ、trueを返します。
    /// </summary>
    /// <param name="query">検索文字列。半角または全角スペースで区切られた複数の単語を含むことができます。</param>
    /// <returns>検索文字列の全ての単語がNameまたはReadingフィールドに存在する場合はtrue、それ以外の場合はfalseを返します。</returns>
    public bool IsMatch(string query)
    {
        // 検索ボックスが空の場合、全件を返す
        if (query.IsNullOrEmpty())
        {
            return true;
        }

        // スペース（半角・全角）で区切ってAnd検索
        var queryWords = query.ToLower().Split(_spaceDelimiters, StringSplitOptions.RemoveEmptyEntries);

        // 検索を容易にするため、英語は小文字に統一する
        string lowerName = Name.ToLower();
        string lowerReading = Reading.ToLower();

        return queryWords.All(x => lowerName.Contains(x) || lowerReading.Contains(x));
    }

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
