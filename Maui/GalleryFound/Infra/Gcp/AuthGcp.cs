using System.Reflection;
using Firebase.Auth;
using Google.Apis.Auth.OAuth2;
using Google.Cloud.Firestore;
using Google.Cloud.Firestore.V1;
using Google.Cloud.Storage.V1;

namespace GalleryFound.Infra.Gcp;

public static class AuthGcp
{
    private const string _projectId = "gallery-found";
    private const string _authDomain = "gallery-found.firebaseapp.com";

    /// <summary>
    /// 匿名認証を行い、DBのインスタンスを取得
    /// </summary>
    /// <param name="apiKey">Firebase WebアプリのAPIキー</param>
    public static async Task<FirestoreDb> Auth_Anonymous(string apiKey)
    {
        // Firebase認証クライアントを生成
        var firebaseClient = new FirebaseAuthClient(new FirebaseAuthConfig
        {
            ApiKey = apiKey,
            AuthDomain = _authDomain,
        });

        // 匿名サインイン
        var firebaseCredential = await firebaseClient.SignInAnonymouslyAsync();

        // 認証情報の取得
        var token = firebaseCredential.User.Credential.IdToken;
        var googleCredential = GoogleCredential.FromAccessToken(token);

        // Firestoreクライアントの構築
        var firestoreClient = new FirestoreClientBuilder { Credential = googleCredential }.Build();

        // FirestoreDBのインスタンス作成
        return await FirestoreDb.CreateAsync(_projectId, firestoreClient);
    }

    /// <summary>
    /// 埋め込みリソースとして配置したサービスアカウントキーで認証
    /// </summary>
    /// <param name="serviceAccountKeyPath">プロジェクトルートのパス</param>
    public static async Task<FirestoreDb> Auth_ResKey(string serviceAccountKeyPath)
    {
        // 埋め込みリソースのサービスアカウントキーをストリームとしてロード
        var assembly = Assembly.GetExecutingAssembly();
        using var stream = assembly.GetManifestResourceStream(serviceAccountKeyPath);

        // 認証情報の取得
        var googleCredential = GoogleCredential.FromStream(stream);

        // Firestoreクライアントの構築
        var firestoreClient = new FirestoreClientBuilder { GoogleCredential = googleCredential }.Build();

        // FirestoreDBのインスタンス作成
        var storage = StorageClient.Create(googleCredential);
        return await FirestoreDb.CreateAsync(_projectId, firestoreClient);
    }

    /// <summary>
    /// ローカルファイルのサービスアカウントキーを環境変数に設定して認証
    /// </summary>
    /// <param name="serviceAccountKeyLocalPath">キーの絶対パス</param>
    public static async Task<FirestoreDb> Auth_EnvKey(string serviceAccountKeyLocalPath)
    {
        // 環境変数からロードする場合
        Environment.SetEnvironmentVariable("GOOGLE_APPLICATION_CREDENTIALS", serviceAccountKeyLocalPath);

        // FirestoreDBのインスタンス作成
        return await FirestoreDb.CreateAsync(_projectId);
    }
}
