using Microsoft.Maui.Storage;

namespace GalleryFound.Infra.Storage;

public class RepoStorage
{
    private const string _latestUpdate = "LatestUpdate";
    private const string _apiKey = "ApiKey";

    public string CacheDir { get; }

    public string DataDir { get; }

    public RepoStorage()
    {
        CacheDir = FileSystem.Current.CacheDirectory;
        DataDir = FileSystem.Current.AppDataDirectory;
    }

    public DateTime GetDataLatestUpdate()
    {
        if (!Preferences.ContainsKey(_latestUpdate))
        {
            throw new KeyNotFoundException();
        }

        return Preferences.Get(_latestUpdate, DateTime.MinValue);
    }

    public void SetDataLatestUpdate(DateTime date)
    {
        Preferences.Set(_latestUpdate, date);
    }

    public string GetDataApiKey()
    {
        if (!Preferences.ContainsKey(_apiKey))
        {
            throw new KeyNotFoundException();
        }

        return Preferences.Get(_apiKey, null);
    }

    public void SetDataApiKey(string value)
    {
        Preferences.Set(_apiKey, value);
    }

    public void SetCache()
    {
        var filePath = Path.Combine(CacheDir, "LatestUpdate.txt");
        var latestUpdate = DateTime.Now;

        File.WriteAllText(filePath, latestUpdate.ToString("o"));
    }
}
