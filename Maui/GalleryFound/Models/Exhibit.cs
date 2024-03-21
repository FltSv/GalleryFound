namespace GalleryFound.Models
{
    /// <summary>
    /// 展示
    /// </summary>
    public class Exhibit
    {
        /// <summary>
        /// 展示名
        /// </summary>
        public string Title { get; set; }

        /// <summary>
        /// 展示場所（ギャラリー）
        /// </summary>
        public string Location { get; set; }

        /// <summary>
        /// イメージ画像URL
        /// </summary>
        public Uri Image { get; set; }

        /// <summary>
        /// 展示日時
        /// </summary>
        public string Date { get; set; }
    }
}
