namespace GalleryFound.Models;

/// <summary>
/// データベース上のメタデータを格納
/// </summary>
public record class DbInfo
{
    /// <summary>
    /// 最終更新日時
    /// </summary>
    public DateTime LatestUpdate { get; init; }

    /// <summary>
    /// 地図ページで表示するURL
    /// </summary>
    public string MapUrl { get; init; }
}
