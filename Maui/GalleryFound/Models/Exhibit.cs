namespace GalleryFound.Models
{
    /// <summary>
    /// 展示
    /// </summary>
    public class Exhibit
    {
        public string Id { get; init; }

        /// <summary>
        /// 展示名
        /// </summary>
        public string Title { get; init; }

        /// <summary>
        /// 展示場所（ギャラリー）
        /// </summary>
        public string Location { get; init; }

        /// <summary>
        /// イメージ画像のファイル名＋トークン
        /// </summary>
        public string Image { get; init; }

        /// <summary>
        /// 展示日時
        /// </summary>
        public string Date { get; init; }
    }
}
