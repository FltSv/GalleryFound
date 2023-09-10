using GalleryFound.Models;
using System.Windows.Input;

namespace GalleryFound.Views;

public partial class ListViewPage : ContentPage
{
	public ListViewPage()
	{
		InitializeComponent();
	}
}

public class ListViewPageVm : VmBase
{
    public List<Product> ViewList { get; } = new();

    private Product _selectedItem;
    public Product SelectedItem
    {
        get => _selectedItem;
        set => SetProperty(ref _selectedItem, value);
    }

    public ICommand OpenDetailCommand { get; }

    public ListViewPageVm()
    {
        ViewList.AddRange(StaticValues.Creators.SelectMany(x => x.Products));

        OpenDetailCommand = new Command(async () =>
        {
            if (SelectedItem is null)
            {
                return;
            }

            var page = new GalleryDetailPage(SelectedItem);
            await Shell.Current.Navigation.PushAsync(page);
            SelectedItem = null;
        });
    }
}
