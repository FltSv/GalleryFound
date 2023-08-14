using System.Reflection;
using Firebase.Auth;
using Google.Apis.Auth.OAuth2;
using Google.Apis.Storage.v1.Data;
using Google.Cloud.Firestore;
using Google.Cloud.Firestore.V1;
using Google.Cloud.Storage.V1;
using GalleryFound.Models;

namespace GalleryFound.Infra.Gcp;

public class RepoGcp
{
    private const string _authorsCollection = "authors";
    private const string _dataCollection = "data";

    private readonly FirestoreDb _firestore;

    public RepoGcp(FirestoreDb firestore)
    {
        _firestore = firestore;
    }

    public async Task<string> GetLatestUpdate()
    {
        var collection = _firestore.Collection(_dataCollection);
        var docRef = collection.Document("data");
        var snapshot = await docRef.GetSnapshotAsync();

        if (!snapshot.Exists)
        {
            return null;
        }

        Dictionary<string, object> dataDict = snapshot.ToDictionary();
        return dataDict["latestUpdate"].ToString();
    }
}
