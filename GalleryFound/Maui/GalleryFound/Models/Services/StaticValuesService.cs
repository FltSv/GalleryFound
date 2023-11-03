using GalleryFound.Infra;
using GalleryFound.Models.StaticValues;

namespace GalleryFound.Models.Services;

/// <summary>
/// 各種StaticValueの制御等を行う
/// </summary>
public static class StaticValuesService
{
    /// <summary>
    /// すべての要素の取得を行う
    /// </summary>
    public static async Task AllLoadAsync()
    {
        var repo = await Factories.GetRepo();

        await Creators.Instance.LoadValuesAsync(repo);
        await Galleries.Instance.LoadValuesAsync(repo);
        await Magazines.Instance.LoadValuesAsync(repo);
    }
}
