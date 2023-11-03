using GalleryFound.Models;
using System.Windows.Input;

namespace GalleryFound.Views;

public partial class MagazineDetailPage : ContentPage
{
	public MagazineDetailPage(Magazine magazine)
    {
        InitializeComponent();
        BindingContext = new MagazineDetailPageVm(magazine);
    }
}

public class MagazineDetailPageVm
{
    public Magazine Magazine { get; }

    public List<ShopUriItem> List { get; } = new();

    public MagazineDetailPageVm(Magazine magazine)
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
