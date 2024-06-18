using GalleryFound.Infra;
using GalleryFound.Models.Repositories;

namespace GalleryFound.Models.Services;

public static class ResourceService
{
    private static readonly IResourceProvider _provider = 
        Factories.GetResourceProvider();

    /// <inheritdoc cref="IResourceProvider.GetImageUrl(string, string)" />
    public static string GetImageUrl(string userId, string image) =>
        _provider.GetImageUrl(userId, image);
}
