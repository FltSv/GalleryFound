using GalleryFound.Models;
using System.Windows.Input;

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

    public Product SelectedItem { get; set; }

    public ICommand OpenDetailCommand { get; }

    public ListViewPageVm()
    {
        ViewList.AddRange(StaticValues.Authors.SelectMany(x => x.Products));

        OpenDetailCommand = new Command(() =>
        {
            if (SelectedItem is null)
            {
                return;
            }

            var page = new GalleryDetailPage(SelectedItem);
            Shell.Current.Navigation.PushAsync(page);
        });
    }
}
