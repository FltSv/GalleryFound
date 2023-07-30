using GalleryFound.Infra.Fake;
using GalleryFound.Models;

namespace GalleryFound.Infra;

public static class Factories
{
    /// <summary>
    /// 模擬データ参照フラグ
    /// </summary>
    public static bool IsDebug { get; } = true;

    public static Author[] GetAuthors()
    {
        if (IsDebug)
        {
            return new RepoFake().GetAuthors();
        }
        else
        {
            throw new NotImplementedException();
        }
    }
}
