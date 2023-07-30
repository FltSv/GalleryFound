using GalleryFound.Models;

namespace GalleryFound.Views;

public partial class ListViewPage : ContentPage
{
	public ListViewPage()
	{
		InitializeComponent();
		BindingContext = new ListViewPageVm();
	}
}

public class ListViewPageVm
{
    public List<Product> ViewList { get; } = new();

    public ListViewPageVm()
    {
        ViewList.AddRange(StaticValues.Authors.SelectMany(x => x.Products));
    }
}
