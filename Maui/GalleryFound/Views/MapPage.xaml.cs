using GalleryFound.Models;
using GalleryFound.Models.StaticValues;

namespace GalleryFound.Views;

public partial class MapPage : ContentPage
{
    public MapPage()
	{
        InitializeComponent();
        BindingContext = new MapPageVm();
	}

    public MapPage(Gallery item = null)
	{
        InitializeComponent();
        BindingContext = new MapPageVm(item);
	}
}

public class MapPageVm
{
	private const string _searchUrl = "https://www.google.com/maps?q=";

    public string Source { get; }

    public MapPageVm(Gallery item = null)
    {
        Source = DbInfoValues.Instance.MapUrl;

        if (string.IsNullOrEmpty(item?.Name)) return;

        Source = _searchUrl + Uri.EscapeDataString(item.Name);
    }
}