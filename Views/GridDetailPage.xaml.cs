using GalleryFound.Models;
using System.Text.RegularExpressions;
using System.Windows.Input;

namespace GalleryFound.Views;

public partial class GridDetailPage : ContentPage
{
	public GridDetailPage(Product product)
    {
        InitializeComponent();
        BindingContext = new GridDetailPageVm(product);
    }
}

public class GridDetailPageVm
{
    public Product Product { get; }

    public List<ShopUriItem> List { get; } = new();

    public GridDetailPageVm(Product product)
    {
        Product = product;
        List.AddRange(product.ShopUriPairs.Select(x => new ShopUriItem(x)));
    }
}

public class ShopUriItem : ShopUriPair
{
    public ImageSource Icon { get; private set; }

    public ICommand OpenPageCommand => new Command(async () =>
    {
        await Launcher.OpenAsync(Uri);
    });

    public ShopUriItem(ShopUriPair source)
    {
        Shop = source.Shop;
        Uri = source.Uri;

        GetFavicon();
    }

    public void GetFavicon()
    {
        if (string.IsNullOrEmpty(Uri))
        {
            return;
        }

        var client = new HttpClient();

        try
        {
            var uri = new Uri(Uri);
            var scheme = uri.Scheme;
            var host = uri.Host;

            // �X�L�[�}(http or https) + :// + ���[�g�p�X + /favicon.ico
            string iconUrl = scheme + "://" + host + "/favicon.ico";

            var responce = client.GetAsync(iconUrl).Result;

            if (!responce.IsSuccessStatusCode)
            {
                throw new Exception();
            }

            var stream = client.GetStreamAsync(iconUrl);
            Icon = ImageSource.FromStream(() => stream.Result);
            return;
        }
        catch (Exception)
        {
            // ���[�g��favicon���Ȃ��ꍇ�ADOM����favicon��T��
            var regex = new Regex("<link.*rel=\"(icon|shortcut\\sicon|apple-touch-icon)\".+href=\"(?<ICON>.+(favicon\\..+|\\.png|\\.ico))\".*>");
            var htmlLines = new HttpClient().GetStringAsync(Uri).Result.Split('\n');
            var target = htmlLines.FirstOrDefault(regex.IsMatch);
            if (target is null)
            {
                return;
            }

            var iconUrl = regex.Match(target).Groups["ICON"].Value;

            if (iconUrl is null)
            {
                return;
            }

            // favicon�̕ۊǏꏊ��"//ssl"����n�܂�ꍇ
            if (iconUrl.StartsWith("//ssl"))
            {
                iconUrl = "http:" + iconUrl;
            }

            // favicon�̕ۊǏꏊ��"../"����n�܂�ꍇ
            else if (iconUrl.StartsWith("../"))
            {
                iconUrl = Uri + iconUrl;
            }

            // ��L�ȊO�̏ꍇ(�t�@�C�����̂݁A���΃p�X��)
            else
            {
                // ���[�g����t�@�r�R�����擾����
                iconUrl = string.Concat(Uri.AsSpan(0, Uri.IndexOf("/", "https://".Length) + 1), iconUrl.TrimStart('/'));
            }

            var stream = client.GetStreamAsync(iconUrl);
            Icon = ImageSource.FromStream(() => stream.Result);

            return;
        }
    }
}
