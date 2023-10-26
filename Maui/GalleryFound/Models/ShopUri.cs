using System.Text.RegularExpressions;

namespace GalleryFound.Models;

public class ShopUri
{
    public ImageSource Icon => GetFavicon();

    public string Uri { get; set; }

    public string DisplayUrl =>
        Uri.Length <= 30 ? Uri : string.Concat(Uri.AsSpan(0, 30), "...");

    public ImageSource GetFavicon()
    {
        if (string.IsNullOrEmpty(Uri))
        {
            return null;
        }

        var client = new HttpClient();

        try
        {
            var uri = new Uri(Uri);
            var scheme = uri.Scheme;
            var host = uri.Host;

            // スキーマ(http or https) + :// + ルートパス + /favicon.ico
            string iconUrl = scheme + "://" + host + "/favicon.ico";

            var responce = client.GetAsync(iconUrl).Result;

            if (!responce.IsSuccessStatusCode)
            {
                throw new Exception();
            }

            var stream = client.GetStreamAsync(iconUrl);
            return ImageSource.FromStream(() => stream.Result);
        }
        catch (Exception)
        {
            // ルートにfaviconがない場合、DOMからfaviconを探す
            var regex = new Regex("<link.*rel=\"(icon|shortcut\\sicon|apple-touch-icon)\".+href=\"(?<ICON>.+(favicon\\..+|\\.png|\\.ico))\".*>");
            var htmlLines = new HttpClient().GetStringAsync(Uri).Result.Split('\n');
            var target = htmlLines.FirstOrDefault(regex.IsMatch);
            if (target is null)
            {
                return null;
            }

            var iconUrl = regex.Match(target).Groups["ICON"].Value;

            if (iconUrl is null)
            {
                return null;
            }

            // faviconの保管場所が"//ssl"から始まる場合
            if (iconUrl.StartsWith("//ssl"))
            {
                iconUrl = "http:" + iconUrl;
            }

            // faviconの保管場所が"../"から始まる場合
            else if (iconUrl.StartsWith("../"))
            {
                iconUrl = Uri + iconUrl;
            }

            // 上記以外の場合(ファイル名のみ、相対パス等)
            else
            {
                // ルートからファビコンを取得する
                iconUrl = string.Concat(Uri.AsSpan(0, Uri.IndexOf("/", "https://".Length) + 1), iconUrl.TrimStart('/'));
            }

            var stream = client.GetStreamAsync(iconUrl);
            return ImageSource.FromStream(() => stream.Result);
        }
    }
}
