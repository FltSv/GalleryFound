using GalleryFound.Models;
using GalleryFound.Models.StaticValues;
using System.Windows.Input;

namespace GalleryFound.Views;

public partial class GalleryListPage : ContentPage
{
	public GalleryListPage()
	{
		InitializeComponent();
	}
}

public class GalleryListPageVm : VmBase
{
    public List<Product> ViewList { get; } = new();

    private Product _selectedItem;
    public Product SelectedItem
    {
        get => _selectedItem;
        set => SetProperty(ref _selectedItem, value);
    }

    public ICommand OpenDetailCommand { get; }

    public GalleryListPageVm()
    {
        ViewList.AddRange(Creators.GetAllCreatorsProducts());

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
