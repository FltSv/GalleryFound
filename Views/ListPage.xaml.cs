using GalleryFound.Models;

namespace GalleryFound.Views;

public partial class ListPage : ContentPage
{
	public ListPage()
	{
		InitializeComponent();
		BindingContext = new ListPageVm();
	}
}

public class ListPageVm
{
    public List<Product> ViewList { get; } = new();

    public ListPageVm()
    {
        ViewList.AddRange(StaticValues.Authors.SelectMany(x => x.Products));
    }
}
