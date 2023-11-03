using GalleryFound.Models;

namespace GalleryFound.Views;

public partial class CreatorDetailPage : ContentPage
{
	public CreatorDetailPage(Creator creator)
	{
		InitializeComponent();
        BindingContext = new CreatorDetailPageVm(creator);
	}
}

public class CreatorDetailPageVm
{
    public Creator Creator { get; }

    public CreatorDetailPageVm(Creator creator)
    {
        Creator = creator;
    }
}
