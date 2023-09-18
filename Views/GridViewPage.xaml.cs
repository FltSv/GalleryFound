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
    public List<Magazine> ViewList { get; } = new();

    private Magazine _selectedItem;
    public Magazine SelectedItem
    {
        get => _selectedItem;
        set => SetProperty(ref _selectedItem, value);
    }

    public ICommand OpenDetailCommand { get; }

    public GridViewPageVm()
    {
        ViewList.AddRange(Magazines.Instance);

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