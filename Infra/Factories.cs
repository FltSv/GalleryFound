using Google.Cloud.Firestore;
using GalleryFound.Infra.Fake;
using GalleryFound.Infra.Gcp;
using GalleryFound.Infra.Storage;
using GalleryFound.Models;

namespace GalleryFound.Infra;

public static class Factories
{
    /// <summary>
    /// 模擬データ参照フラグ
    /// </summary>
    public static bool IsDebug { get; } = true;

    public static Author[] GetAuthors()
    {
        if (IsDebug)
        {
            return new RepoFake().GetAuthors();
        }
        else
        {
            throw new NotImplementedException();
        }
    }

    public static async Task<FirestoreDb> AuthDb()
    {
        // ストレージからAPI Keyの取得試行
        var storage = new RepoStorage();
        string apiKey;

        try
        {
            apiKey = storage.GetDataApiKey();
        }
        catch
        {
            string msg = "APIキーがストレージに見つかりませんでした。APIキーを入力してください。";
            apiKey = await ShowPopup(msg);
        }

        // データベースへの接続試行
        FirestoreDb firestore = null;
        while (firestore is null)
        {
            try
            {
                firestore = await AuthGcp.Auth_Anonymous(apiKey);
            }
            catch
            {
                string msg = "入力されたAPIキーで、データベースの接続ができませんでした。もう一度入力してください。";
                apiKey = await ShowPopup(msg);
            }
        }

        // データベースに接続を確認できてから、ストレージに登録
        storage.SetDataApiKey(apiKey);

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
}
