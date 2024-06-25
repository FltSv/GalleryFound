using GalleryFound.Models;
using GalleryFound.Models.Services;
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
    public List<GalleryListItem> ViewList { get; } = new();

    private GalleryListItem _selectedItem;
    public GalleryListItem SelectedItem
    {
        get => _selectedItem;
        set => SetProperty(ref _selectedItem, value);
    }

    public ICommand OpenDetailCommand { get; }

    public GalleryListPageVm()
    {
        var items = Creators.Instance
            .SelectMany(creator => creator.Exhibits
                .Select(exhibit => new GalleryListItem(exhibit, creator)));
        ViewList.AddRange(items);

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

public class GalleryListItem(Exhibit exhibit, Creator creator)
{
    public Exhibit Exhibit { get; } = exhibit;

    public Creator Creator { get; } = creator;

    public string ImageUrl => ResourceService.GetImageUrl(Creator.Id, Exhibit.Image);
}
