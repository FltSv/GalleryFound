namespace GalleryFound.Models;

public readonly struct Shops
{
    private static readonly Dictionary<_shops, Uri> _logoDict = new()
    {
        { _shops.Amazon, new Uri("https://upload.wikimedia.org/wikipedia/commons/4/4a/Amazon_icon.svg") },
    };

    private readonly _shops _value;

    public static readonly Shops Amazon = new(_shops.Amazon);

    public Uri Logo => _logoDict[_value];

    private Shops(_shops value) => _value = value;

    public override string ToString() => _value.ToString();

    private enum _shops
    {
        Amazon,
    }
}
