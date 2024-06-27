using GalleryFound.Models;
using GalleryFound.Models.StaticValues;
using Microsoft.Maui.Handlers;

namespace GalleryFound.Views;

public partial class MapPage : ContentPage
{
    public MapPage()
	{
        InitializeComponent();
        BindingContext = new MapPageVm();
    }

    public MapPage(Gallery item = null)
	{
        InitializeComponent();
        BindingContext = new MapPageVm(item);
	}

    private void WebView_Loaded(object sender, EventArgs e)
    {
        var webView = sender as WebView;

#if ANDROID
        var webViewHandler = webView.Handler as IWebViewHandler;
        webViewHandler.PlatformView.SetWebChromeClient(new MyWebChromeClient());
#endif
    }
}

#if ANDROID
internal class MyWebChromeClient : Android.Webkit.WebChromeClient
{
    public static async Task<PermissionStatus> TryRequestPermission<TPermission>()
        where TPermission : Permissions.BasePermission, new()
    {
        var status = await Permissions.CheckStatusAsync<TPermission>();

        if (status == PermissionStatus.Granted)
        {
            return status;
        }

        if (status == PermissionStatus.Denied && DeviceInfo.Platform == DevicePlatform.iOS)
        {
            // todo: Prompt the user to turn on in settings
            return status;
        }

        if (Permissions.ShouldShowRationale<TPermission>())
        {
            // todo: Prompt the user with additional information as to why the permission is needed
        }

        return await Permissions.RequestAsync<TPermission>();
    }

    public override async void OnGeolocationPermissionsShowPrompt(string origin, Android.Webkit.GeolocationPermissions.ICallback callback)
    {
        var permissionStatus = await TryRequestPermission<Permissions.LocationWhenInUse>();
        base.OnGeolocationPermissionsShowPrompt(origin, callback);
        callback.Invoke(origin, true, false);
    }
}
#endif

public class MapPageVm
{
	private const string _searchUrl = "https://www.google.com/maps?q=";

    public string Source { get; }

    public MapPageVm(Gallery item = null)
    {
        Source = DbInfoValues.Instance.MapUrl;

        if (string.IsNullOrEmpty(item?.Name)) return;

        Source = _searchUrl + Uri.EscapeDataString(item.Name);
    }
}
