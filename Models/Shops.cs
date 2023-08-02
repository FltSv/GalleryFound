namespace GalleryFound.Models;

public readonly struct Shops
{
    private static readonly Dictionary<_shops, string> _logoDict = new()
    {
        { _shops.Amazon, $"amazon.png" },
    };

    private readonly _shops _value;

    public static readonly Shops Amazon = new(_shops.Amazon);

    public string Logo => _logoDict[_value];

    private Shops(_shops value) => _value = value;

    public override string ToString() => _value.ToString();

    private enum _shops
    {
        Amazon,
    }
}
