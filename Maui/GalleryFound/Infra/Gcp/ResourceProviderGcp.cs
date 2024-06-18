using GalleryFound.Models.Repositories;

namespace GalleryFound.Infra.Gcp;

public class ResourceProviderGcp : IResourceProvider
{
    public string GetImageUrl(string userId, string image) =>
        $"https://firebasestorage.googleapis.com/v0/b/gallery-found.appspot.com/o/creators%2F{userId}%2F{image}";
}
