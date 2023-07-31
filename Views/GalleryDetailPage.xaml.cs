using GalleryFound.Models;
using System.Windows.Input;

namespace GalleryFound.Views;

public partial class GalleryDetailPage : ContentPage
{
	public GalleryDetailPage(Product product)
	{
		InitializeComponent();
        BindingContext = new GalleryDetailPageVm(product);
	}
}

public class GalleryDetailPageVm
{
    public Product Product { get; }

    public ICommand OpenGalleryMapCommand { get; }

    public GalleryDetailPageVm(Product product)
    {
        Product = product;

        OpenGalleryMapCommand = new Command(() =>
        {
            var page = new MapPage(product.Gallery.Name);
            Shell.Current.Navigation.PushAsync(page);
        });
    }
}