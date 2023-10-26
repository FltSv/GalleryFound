namespace GalleryFound.Views;

public partial class MapPage : ContentPage
{
    public MapPage()
	{
        InitializeComponent();
        BindingContext = new MapPageVm();
	}

    public MapPage(string query = null)
	{
        InitializeComponent();
        BindingContext = new MapPageVm(query);
	}
}

public class MapPageVm
{
	private const string _searchUrl = "https://www.google.com/maps/search/";
	private const string _defaultUrl = "https://goo.gl/maps/eMgnsvkndthT3Be26";

	public string Source { get; } = _defaultUrl;

    public MapPageVm(string query = null)
    {
		if (query is null)
		{
			return;
		}

		Source = _searchUrl + query;
    }
}