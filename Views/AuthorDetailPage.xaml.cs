using GalleryFound.Models;

namespace GalleryFound.Views;

public partial class AuthorDetailPage : ContentPage
{
	public AuthorDetailPage(Author author)
	{
		InitializeComponent();
        BindingContext = new AuthorDetailPageVm(author);
	}
}

public class AuthorDetailPageVm
{
    public Author Author { get; }

    public AuthorDetailPageVm(Author author)
    {
        Author = author;
    }
}
