﻿using Google.Cloud.Firestore;
using GalleryFound.Infra.Fake;
using GalleryFound.Infra.Gcp;
using GalleryFound.Infra.Storage;
using GalleryFound.Models.Repositories;

namespace GalleryFound.Infra;

public static class Factories
{
    /// <summary>
    /// 模擬データ参照フラグ
    /// </summary>
    public static bool IsFake { get; } = false;

    public static async Task<IRepo> GetRepo()
    {
#if DEBUG
        if (IsFake)
        {
            return new RepoFake();
        }
#endif

        var firestore = await AuthDb();
        return new RepoGcp(firestore);
    }

    public static IResourceProvider GetResourceProvider()
    {
#if DEBUG
        if (IsFake)
        {
            return new ResourceProviderFake();
        }
#endif

        return new ResourceProviderGcp();
    }

    public static async Task<FirestoreDb> AuthDb()
    {
        // ストレージからAPI Keyの取得試行
        var storage = new RepoStorage();

        // データベースへの接続試行
        FirestoreDb firestore = null;
        while (firestore is null)
        {
            try
            {
                firestore = await AuthGcp.Auth_Anonymous();
            }
            catch
            {
                string msg = "failed Anonymous login.";
                await ShowPopup(msg);
            }
        }

        return firestore;


        // データベース接続エラー時に表示する入力ポップアップ
        static async Task<string> ShowPopup(string message)
        {
            // メインページがLoadされるまで待機
            while ((!Shell.Current?.CurrentPage?.IsLoaded) ?? true)
            {
                await Task.Delay(100);
            }

            string title = "[Debug] DB接続エラー";
            string value = await Shell.Current.CurrentPage.DisplayPromptAsync(title, message, "OK", null);

            // キャンセル押下時はアプリ終了
            if (value is null)
            {
                Application.Current.Quit();
            }

            return value;
        }
    }

    /// <summary>
    /// ストレージとサーバーの更新日時の比較を行う
    /// </summary>
    public static async Task<bool> HasUpdateDbCheck()
    {
        try
        {
            // ストレージから更新日時を取得
            var storage = new RepoStorage();
            var localDate = storage.GetDataLatestUpdate();

            // サーバーから更新日時を取得
            var remote = await Factories.GetRepo();
            var remoteInfo = await remote.GetDbInfoAsync();
            var remoteDate = remoteInfo.LatestUpdate;

            // サーバー側の更新日時がストレージを超えていれば、更新が必要とする
            return remoteDate > localDate;
        }
        catch
        {
            // 例外発生時は更新を必要とする
            return true;
        }
    }
}
