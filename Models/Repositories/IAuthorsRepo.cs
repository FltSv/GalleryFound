namespace GalleryFound.Models.Repositories;

public interface IAuthorsRepo
{
    public Task<Author[]> GetAuthorsAsync();

    /// <summary>
    /// データベース上のメタデータ等を取得
    /// </summary>
    public Task<DbInfo> GetDbInfoAsync();
}
