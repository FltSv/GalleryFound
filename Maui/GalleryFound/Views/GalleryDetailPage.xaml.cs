using GalleryFound.Infra;
using GalleryFound.Models;
using System.Windows.Input;

namespace GalleryFound.Views;

public partial class GalleryDetailPage : ContentPage
{
	public GalleryDetailPage(GalleryListItem item)
	{
		InitializeComponent();
        BindingContext = new GalleryDetailPageVm(item);
	}
}

public class GalleryDetailPageVm
{
    public Exhibit Exhibit { get; }

    public Creator Creator { get; }

    public string ImageUrl => Factories.getImageUrl(Creator.Id, Exhibit.Image);

    public ICommand OpenGalleryMapCommand { get; }

    public ICommand OpenCreatorCommand { get; }

    public GalleryDetailPageVm(GalleryListItem item)
    {
        Exhibit = item.Exhibit;
        Creator = item.Creator;

        OpenGalleryMapCommand = new Command(async () =>
        {
            var page = new MapPage(Exhibit.Location);
            await Shell.Current.Navigation.PushAsync(page);
        });

        OpenCreatorCommand = new Command(async () =>
        {
            var page = new CreatorDetailPage(Creator);
            await Shell.Current.Navigation.PushAsync(page);
        });
    }
}