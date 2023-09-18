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
        await Creators.Instance.LoadValuesAsync();
        await Galleries.Instance.LoadValuesAsync();
        await Magazines.Instance.LoadValuesAsync();
    }
}
