namespace GalleryFound.Models.Repositories;

public interface IRepo
{
    /// <summary>
    /// <see cref="Creator"/> のリストを取得
    /// </summary>
    /// <returns></returns>
    public Task<Creator[]> GetCreatorsAsync();

    /// <summary>
    /// <see cref="Gallery"/> のリストを取得
    /// </summary>
    /// <returns></returns>
    public Task<Gallery[]> GetGalleriesAsync();

    /// <summary>
    /// <see cref="Magazine"/> のリストを取得
    /// </summary>
    /// <returns></returns>
    public Task<Magazine[]> GetMagazinesAsync();

    /// <summary>
    /// データベース上のメタデータ等を取得
    /// </summary>
    public Task<DbInfo> GetDbInfoAsync();
}
