using GalleryFound.Models;
using System.Windows.Input;

namespace GalleryFound.Views;

public partial class GridDetailPage : ContentPage
{
	public GridDetailPage(Magazine magazine)
    {
        InitializeComponent();
        BindingContext = new GridDetailPageVm(magazine);
    }
}

public class GridDetailPageVm
{
    public Magazine Magazine { get; }

    public List<ShopUriItem> List { get; } = new();

    public GridDetailPageVm(Magazine magazine)
    {
        Magazine = magazine;
        List.AddRange(magazine.Shops.Select(x => new ShopUriItem(x)));
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
