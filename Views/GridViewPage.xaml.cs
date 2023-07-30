using GalleryFound.Models;

namespace GalleryFound.Views;

public partial class GridViewPage : ContentPage
{
	public GridViewPage()
	{
		InitializeComponent();
	}
}

public class GridViewPageVm
{
    public List<Product> ViewList { get; } = new();

    public GridViewPageVm()
    {
        ViewList.AddRange(StaticValues.Authors.SelectMany(x => x.Products));
    }
}