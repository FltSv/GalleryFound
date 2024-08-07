﻿using Google.Cloud.Firestore;
using GalleryFound.Models;
using GalleryFound.Models.Repositories;

namespace GalleryFound.Infra.Gcp;

public class RepoGcp : IRepo
{
    private readonly FirestoreDb _firestore;

    private static readonly Dictionary<string, string> _keyDict = new()
    {
        { nameof(DbInfo.LatestUpdate), "latestUpdate" },
        { nameof(DbInfo.MapUrl), "mapUrl" },
    };

    public RepoGcp(FirestoreDb firestore)
    {
        _firestore = firestore;
    }

    public async Task<Creator[]> GetCreatorsAsync()
    {
        var creatorRef = _firestore.Collection(CollectionNames.Creators);
        var creatorSs = await creatorRef.GetSnapshotAsync();

        var list = new List<Creator>();
        foreach (var item in creatorSs.Documents)
        {
            var creator = new Creator
            {
                Id = item.Id,
                Name = item.GetValue<string>("name")
            };

            var products = item.GetValue<List<Dictionary<string, string>>>("products");
            foreach (var productItem in products)
            {
                creator.Products.Add(new Product
                {
                    Id = productItem["id"],
                    Image = productItem["image"],
                });
            }

            var exhibits = item.GetValue<List<Dictionary<string, object>>>("exhibits");
            foreach (var exhibitItem in exhibits)
            {
                var startTimestamp = (Timestamp)exhibitItem["startDate"];
                var endTimestamp = (Timestamp)exhibitItem["endDate"];

                creator.Exhibits.Add(new Exhibit
                {
                    Id = exhibitItem["id"] as string,
                    Title = exhibitItem["title"] as string,
                    StartDate = startTimestamp.ToDateTime(),
                    EndDate = endTimestamp.ToDateTime(),
                    Image = exhibitItem["image"] as string,
                    Location = exhibitItem["location"] as string,
                });
            }

            list.Add(creator);
        }

        return [.. list];
    }

    public async Task<Gallery[]> GetGalleriesAsync()
    {
        var docRef = _firestore.Collection(CollectionNames.Galleries);
        var querySnap = await docRef.GetSnapshotAsync();

        return querySnap.Select(docSnap => new Gallery
        {
            Id = docSnap.Id,
            Name = docSnap.GetValue<string>("name"),
            Location = docSnap.GetValue<string>("location"),
        }).ToArray();
    }

    public async Task<Magazine[]> GetMagazinesAsync()
    {
        // todo
        await Task.Delay(100);
        return [];
    }

    public async Task<DbInfo> GetDbInfoAsync()
    {
        var collection = _firestore.Collection(CollectionNames.Data);
        var docRef = collection.Document("data");
        var snapshot = await docRef.GetSnapshotAsync();

        if (!snapshot.Exists)
        {
            throw new Exception("データベース情報の取得時にエラーが発生しました。");
        }

        return new()
        {
            LatestUpdate = snapshot.GetValue<DateTime>(_keyDict[nameof(DbInfo.LatestUpdate)]),
            MapUrl = snapshot.GetValue<string>(_keyDict[nameof(DbInfo.MapUrl)]),
        };
    }
}

static class CollectionNames
{
    public static string Creators = "creators";
    public static string Galleries = "galleries";
    public static string Data = "data";
}