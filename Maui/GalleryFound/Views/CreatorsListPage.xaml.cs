using GalleryFound.Models;
using GalleryFound.Models.StaticValues;
using System.Windows.Input;

namespace GalleryFound.Views;

public partial class CreatorListPage : ContentPage
{
    public CreatorListPage()
	{
		InitializeComponent();
        ((CreatorListPageVm)BindingContext).ScrollCreatorListAction += ScrollToCreator;
    }

    public CreatorListPage(Creator creator) : this()
    {
        creatorListCollectionView.Loaded += (s, e) =>
        {
            ScrollToCreator(creator);
        };
    }

    /// <summary>
    /// 作家一覧の中から <paramref name="creator"/> で指定した要素までジャンプ（スクロール）
    /// </summary>
    private void ScrollToCreator(Creator creator)
    {
        creatorListCollectionView.ScrollTo(creator);
    }
}

public class CreatorListPageVm : VmBase
{
    /// <summary>
    /// 検索ボックスに入力されたテキスト
    /// </summary>
    public string SearchText
    {
        get => _searchText;
        set
        {
            _searchText = value;
            OnPropertyChanged(nameof(CreatorList));
            OnPropertyChanged(nameof(InitialList));
        }
    }
    private string _searchText = string.Empty;

    /// <summary>
    /// 作者の名前リスト
    /// </summary>
	public List<Creator> CreatorList =>
        GetSearchedList(SearchText).OrderBy(x => x.Reading).ToList();

    /// <summary>
    /// 名前の頭文字リスト
    /// </summary>
    public List<string> InitialList =>
        CreatorList.Select(x => x.Initial).Distinct().ToList();

    /// <summary>
    /// 作者一覧で選択された要素
    /// </summary>
	public Creator SelectedCreator
	{
		get => _selectedCreator;
		set => SetProperty(ref _selectedCreator, value);
	}
	private Creator _selectedCreator;

    /// <summary>
    /// 作者の詳細を開くコマンド
    /// </summary>
    public ICommand OpenDetailCommand { get; }

    /// <summary>
    /// 頭文字一覧で選択された要素
    /// </summary>
    public string SelectedInitial
    {
        get => _selectedInitial;
        set => SetProperty(ref _selectedInitial, value);
    }
    private string _selectedInitial;

    /// <summary>
    /// 頭文字を選択した時に実行するコマンド
    /// </summary>
    public ICommand SelectInitialCommand { get; }

    /// <summary>
    /// 作者リストのスクロールを行うメソッドを格納しておく
    /// </summary>
    public Action<Creator> ScrollCreatorListAction { get; set; }

    public CreatorListPageVm()
    {
        OpenDetailCommand = new Command(async () =>
        {
            if (SelectedCreator is null)
            {
                return;
            }

            var page = new CreatorDetailPage(SelectedCreator);
            await Shell.Current.Navigation.PushAsync(page);
            SelectedCreator = null;
        });

        SelectInitialCommand = new Command(() =>
        {
            if (SelectedInitial is null)
            {
                return;
            }

            var targetCreator = CreatorList.FirstOrDefault(x => x.Initial == SelectedInitial);

            if (targetCreator is null)
            {
                return;
            }

            ScrollCreatorListAction?.Invoke(targetCreator);

            SelectedInitial = null;
        });
    }

    public static IEnumerable<Creator> GetSearchedList(string searchText)
    {
        return Creators.Instance.Where(x => x.IsMatch(searchText));
    }
}