using GalleryFound.Models;
using GalleryFound.Models.Services;

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

    public List<ProductItem> ProductItems { get; }

    public List<ExhibitItem> ExhibitItems { get; }

    public CreatorDetailPageVm(Creator creator)
    {
        Creator = creator;
        ProductItems = Creator.Products.Select(x => new ProductItem(x, Creator)).ToList();
        ExhibitItems = Creator.Exhibits.Select(x => new ExhibitItem(x, Creator)).ToList();
    }
}

public record class ProductItem : Product
{
    public ProductItem(Product original, Creator Creator) : base(original)
    {
        CreatorId = Creator.Id;
    }

    public string CreatorId { get; }

    public string ImageUrl => ResourceService.GetImageUrl(CreatorId, Image);
}

public record class ExhibitItem : Exhibit
{
    public ExhibitItem(Exhibit exhibit, Creator creator) : base(exhibit)
    {
         CreatorId = creator.Id;
    }

    public string CreatorId { get; }

    public string ImageUrl => ResourceService.GetImageUrl(CreatorId, Image);
}