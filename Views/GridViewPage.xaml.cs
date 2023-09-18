using GalleryFound.Models;
using GalleryFound.Models.StaticValues;
using System.Windows.Input;

namespace GalleryFound.Views;

public partial class GridViewPage : ContentPage
{
	public GridViewPage()
	{
		InitializeComponent();
	}
}

public class GridViewPageVm : VmBase
{
    public List<Product> ViewList { get; } = new();

    private Product _selectedItem;
    public Product SelectedItem
    {
        get => _selectedItem;
        set => SetProperty(ref _selectedItem, value);
    }

    public ICommand OpenDetailCommand { get; }

    public GridViewPageVm()
    {
        ViewList.AddRange(Creators.Instance.SelectMany(x => x.Products));

        OpenDetailCommand = new Command(async () =>
        {
            if (SelectedItem is null)
            {
                return;
            }

            var page = new GridDetailPage(SelectedItem);
            await Shell.Current.Navigation.PushAsync(page);
            SelectedItem = null;
        });
    }
}