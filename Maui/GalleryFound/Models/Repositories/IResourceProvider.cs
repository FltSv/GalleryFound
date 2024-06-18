namespace GalleryFound.Models.Repositories;

public interface IResourceProvider
{
    /// <summary>
    /// 画像URLを取得する
    /// </summary>
    /// <param name="userId">クリエイターのユーザーID</param>
    /// <param name="image">DBのファイル名＋トークン</param>
    public string GetImageUrl(string userId, string image);
}
