namespace GalleryFound.Models.Repositories;

public interface IAuthorsRepo
{
    public Task<Author[]> GetAuthorsAsync();
}
