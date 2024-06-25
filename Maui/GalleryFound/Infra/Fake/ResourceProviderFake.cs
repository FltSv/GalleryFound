using GalleryFound.Models.Repositories;

namespace GalleryFound.Infra.Fake
{
    public class ResourceProviderFake : IResourceProvider
    {
        public string GetImageUrl(string userId, string image) => image;
    }
}
