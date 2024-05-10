using GalleryFound.Models.Services;
using System.Windows.Input;

namespace GalleryFound;

public partial class MainPage : ContentPage
{
	public bool IsLoading { get; private set; } = true;

	public bool IsActive => !IsLoading;

	public ICommand ButtonCommand { get; }

	public MainPage()
	{
		InitializeComponent();

		// メイン画面描画後、各種値のロード
		Loaded += async (s, e) =>
        {
            await StaticValuesService.AllLoadAsync();
			IsLoading = false;
			OnPropertyChanged(nameof(IsLoading));
			OnPropertyChanged(nameof(IsActive));
        };

		ButtonCommand = new Command<Type>(x =>
		{
            if (x is null)
            {
                return;
            }

            var page = (Page)Activator.CreateInstance(x);
            Shell.Current.Navigation.PushAsync(page);
		});

		BindingContext = this;
	}
}
