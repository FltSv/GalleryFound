using System.Globalization;

namespace GalleryFound.Views.Converters;

public class CreatorImageUrlConverter : IValueConverter
{
    public object Convert(object value, Type targetType, object parameter, CultureInfo culture)
    {
        var url = value as string;
        var page = parameter as ContentPage;
        var vm = page.BindingContext as CreatorDetailPageVm;
        var creator = vm.Creator;
        var image = $"https://firebasestorage.googleapis.com/v0/b/gallery-found.appspot.com/o/creators%2F{creator.Id}%2F{url}";
        return image;
    }

    public object ConvertBack(object value, Type targetType, object parameter, CultureInfo culture) => 
        throw new NotImplementedException();
}
