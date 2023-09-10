using GalleryFound.Models;
using GalleryFound.Models.Repositories;

namespace GalleryFound.Infra.Fake;

public class RepoFake : ICreatorsRepo
{
    private readonly Creator[] _creators = new (string, string)[]
    {
        ("村上 春樹", "むらかみ はるき"),
        ("太宰 治", "だざい おさむ"),
        ("芥川 龍之介", "あくたがわ りゅうのすけ"),
        ("三島 由紀夫", "みしま ゆきお"),
        ("川端 康成", "かわばた やすなり"),
        ("井上 雄彦", "いのうえ たけひこ"),
        ("樋口 一葉", "ひぐち いちよう"),
        ("吉本 ばなな", "よしもと ばなな"),
        ("谷崎 潤一郎", "たにざき じゅんいちろう"),
        ("伊坂 幸太郎", "いさか こうたろう"),
        ("Ernest Hemingway", null),
        ("Virginia Woolf", null),
        ("George Orwell", null),
        ("F. Scott Fitzgerald", null),
        ("Mark Twain", null),
        ("Charles Dickens", null),
        ("Jane Austen", null),
        ("J.D. Salinger", null),
        ("Harper Lee", null),
        ("J.R.R. Tolkien", null),
        ("J.K. Rowling", null),
        ("Stephen King", null),
        ("Agatha Christie", null),
        ("James Joyce", null),
        ("Oscar Wilde", null),
        ("Leo Tolstoy", null),
        ("Fyodor Dostoevsky", null),
        ("Edgar Allan Poe", null),
        ("William Shakespeare", null),
        ("Arthur Conan Doyle", null)
    }.Select(x => new Creator() { Name = x.Item1, Reading = x.Item2 }).ToArray();

    private readonly Gallery[] _galleries = new[]
    {
        "東京現代美術館",
        "上野の森美術館",
        "モリアーツ美術館",
        "国立新美術館",
        "京都国立博物館",
        "大阪市立美術館",
        "福岡アジア美術館",
        "名古屋市美術館",
        "兵庫県立美術館",
        "岡山県立美術館",
        "北海道立近代美術館",
        "新潟市美術館",
        "広島市現代美術館",
        "長崎県美術館",
        "奈良県立美術館",
        "山口県立美術館",
        "岩手県立美術館",
        "鳥取県立美術館",
        "沖縄県立美術館",
        "東京都写真美術館"
    }.Select(x => new Gallery() { Name = x }).ToArray();

    private readonly Uri[] _imageUris = new[]
    {
        @"https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Papio_anubis_%28Serengeti%2C_2009%29.jpg/200px-Papio_anubis_%28Serengeti%2C_2009%29.jpg",
        @"https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Capuchin_Costa_Rica.jpg/200px-Capuchin_Costa_Rica.jpg",
        @"https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/BlueMonkey.jpg/220px-BlueMonkey.jpg",
        @"https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Saimiri_sciureus-1_Luc_Viatour.jpg/220px-Saimiri_sciureus-1_Luc_Viatour.jpg",
        @"https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Golden_lion_tamarin_portrait3.jpg/220px-Golden_lion_tamarin_portrait3.jpg",
        @"https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Alouatta_guariba.jpg/200px-Alouatta_guariba.jpg",
        @"https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Macaca_fuscata_fuscata1.jpg/220px-Macaca_fuscata_fuscata1.jpg",
        @"https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Mandrill_at_san_francisco_zoo.jpg/220px-Mandrill_at_san_francisco_zoo.jpg",
        @"https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Proboscis_Monkey_in_Borneo.jpg/250px-Proboscis_Monkey_in_Borneo.jpg",
        @"https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Portrait_of_a_Douc.jpg/159px-Portrait_of_a_Douc.jpg",
        @"https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Cuc.Phuong.Primate.Rehab.center.jpg/320px-Cuc.Phuong.Primate.Rehab.center.jpg",
        @"https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Golden_Snub-nosed_Monkeys%2C_Qinling_Mountains_-_China.jpg/165px-Golden_Snub-nosed_Monkeys%2C_Qinling_Mountains_-_China.jpg",
        @"https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/RhinopitecusBieti.jpg/320px-RhinopitecusBieti.jpg",
        @"https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Tonkin_snub-nosed_monkeys_%28Rhinopithecus_avunculus%29.jpg/320px-Tonkin_snub-nosed_monkeys_%28Rhinopithecus_avunculus%29.jpg",
        @"https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Thomas%27s_langur_Presbytis_thomasi.jpg/142px-Thomas%27s_langur_Presbytis_thomasi.jpg",
        @"https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/Semnopithèque_blanchâtre_mâle.JPG/192px-Semnopithèque_blanchâtre_mâle.JPG",
        @"https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Gelada-Pavian.jpg/320px-Gelada-Pavian.jpg",
    }.Select(x => new Uri(x)).ToArray();

    public Task<Creator[]> GetCreatorsAsync() => Task.Run(GetCreators);

    public Creator[] GetCreators()
    {
        const int daysInHalfYear = 182; // 半年を近似
        var rnd = new Random();

        var products = new List<Product>();
        var amazonUri = new ShopUri() { Uri = "https://www.amazon.co.jp" };

        for (int i = 0; i < 50; i++)
        {
            // 日数をランダムに決める。範囲は -182 〜 182
            int randomHalfYearDays = rnd.Next(-daysInHalfYear, daysInHalfYear);

            // ランダムな日数を今日の日付に加算する
            var randomDate = DateTime.Today.AddDays(randomHalfYearDays);

            var product = new Product()
            {
                Image = _imageUris[rnd.Next(_imageUris.Length)],
                Creator = _creators[rnd.Next(_creators.Length)],
                Gallery = _galleries[rnd.Next(_galleries.Length)],
                ReleaseDate = randomDate,
            };
            product.ShopUriPairs.Add(amazonUri);

            products.Add(product);
        }

        return products.GroupBy(x => x.Creator).Select(x =>
        {
            x.Key.Products.AddRange(x);
            return x.Key;
        }).ToArray();
    }

    public Task<DbInfo> GetDbInfoAsync() => Task.Run(() => new DbInfo
    {
        LatestUpdate = DateTime.MinValue
    });
}
