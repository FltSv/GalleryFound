namespace GalleryFound.Models.Repositories;

public interface ICreatorsRepo
{
    public Task<Creator[]> GetCreatorsAsync();

    /// <summary>
    /// データベース上のメタデータ等を取得
    /// </summary>
    public Task<DbInfo> GetDbInfoAsync();
}
