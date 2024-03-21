using System.Reflection;
using Firebase.Auth;
using Google.Apis.Auth.OAuth2;
using Google.Apis.Storage.v1.Data;
using Google.Cloud.Firestore;
using Google.Cloud.Firestore.V1;
using Google.Cloud.Storage.V1;
using GalleryFound.Models;
using GalleryFound.Models.Repositories;

namespace GalleryFound.Infra.Gcp;

public class RepoGcp : IRepo
{
    private const string _creatorsCollection = "creators";
    private const string _dataCollection = "data";

    private readonly FirestoreDb _firestore;

    private static readonly Dictionary<string, string> _keyDict = new()
    {
        { nameof(DbInfo.LatestUpdate), "latestUpdate" },
    };

    public RepoGcp(FirestoreDb firestore)
    {
        _firestore = firestore;
    }

    public async Task<Creator[]> GetCreatorsAsync()
    {
        var creatorRef = _firestore.Collection(_creatorsCollection);
        var creatorSs = await creatorRef.GetSnapshotAsync();

        var list = new List<Creator>();
        foreach (var item in creatorSs.Documents)
        {
            var creator = new Creator
            {
                Name = item.GetValue<string>("name")
            };

            var exhibits = item.GetValue<List<Dictionary<string, string>>>("exhibits");
            foreach (var exhibitItem in exhibits)
            {
                creator.Exhibits.Add(new Exhibit
                {
                    Title = exhibitItem["title"],
                    Date = exhibitItem["date"],
                    Image = new Uri(exhibitItem["image"]),
                    Location = exhibitItem["location"]
                });
            }

            list.Add(creator);
        }

        return [.. list];
    }

    public async Task<Gallery[]> GetGalleriesAsync()
    {
        throw new NotImplementedException();
    }

    public async Task<Magazine[]> GetMagazinesAsync()
    {
        throw new NotImplementedException();
    }

    public async Task<DbInfo> GetDbInfoAsync()
    {
        var collection = _firestore.Collection(_dataCollection);
        var docRef = collection.Document("data");
        var snapshot = await docRef.GetSnapshotAsync();

        if (!snapshot.Exists)
        {
            throw new Exception("データベース情報の取得時にエラーが発生しました。");
        }

        return new()
        {
            LatestUpdate = snapshot.GetValue<DateTime>(_keyDict[nameof(DbInfo.LatestUpdate)])
        };
    }
}
