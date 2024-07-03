namespace GalleryFound.Models
{
    /// <summary>
    /// 展示
    /// </summary>
    public record class Exhibit
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
        /// 展示開始日
        /// </summary>
        public DateTime StartDate { get; init; }

        /// <summary>
        /// 展示終了日
        /// </summary>
        public DateTime EndDate { get; init; }

        /// <summary>
        /// 展示日の表示
        /// </summary>
        public string DisplayDate => $"{StartDate:yyyy/MM/dd} ～ {EndDate:yyyy/MM/dd}";
    }
}
