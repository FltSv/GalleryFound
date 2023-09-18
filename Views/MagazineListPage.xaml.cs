using GalleryFound.Models;
using GalleryFound.Models.StaticValues;
using System.Windows.Input;

namespace GalleryFound.Views;

public partial class MagazineListPage : ContentPage
{
	public MagazineListPage()
	{
		InitializeComponent();
	}
}

public class MagazineListPageVm : VmBase
{
    public List<Magazine> ViewList { get; } = new();

    private Magazine _selectedItem;
    public Magazine SelectedItem
    {
        get => _selectedItem;
        set => SetProperty(ref _selectedItem, value);
    }

    public ICommand OpenDetailCommand { get; }

    public MagazineListPageVm()
    {
        ViewList.AddRange(Magazines.Instance);

        OpenDetailCommand = new Command(async () =>
        {
            if (SelectedItem is null)
            {
                return;
            }

            var page = new MagazineDetailPage(SelectedItem);
            await Shell.Current.Navigation.PushAsync(page);
            SelectedItem = null;
        });
    }
}