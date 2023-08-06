using GalleryFound.Models;
using System.Windows.Input;

namespace GalleryFound.Views;

public partial class GridDetailPage : ContentPage
{
	public GridDetailPage(Product product)
    {
        InitializeComponent();
        BindingContext = new GridDetailPageVm(product);
    }
}

public class GridDetailPageVm
{
    public Product Product { get; }

    public List<ShopUriItem> List { get; } = new();

    public GridDetailPageVm(Product product)
    {
        Product = product;
        List.AddRange(product.ShopUriPairs.Select(x => new ShopUriItem(x)));
    }
}

public class ShopUriItem : ShopUri
{
    public ICommand OpenPageCommand => new Command(async () =>
    {
        await Launcher.OpenAsync(Uri);
    });

    public ShopUriItem(ShopUri source)
    {
        Uri = source.Uri;
    }
}
