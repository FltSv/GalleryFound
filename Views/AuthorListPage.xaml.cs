using GalleryFound.Models;
using System.Windows.Input;

namespace GalleryFound.Views;

public partial class AuthorListPage : ContentPage
{
	public AuthorListPage()
	{
		InitializeComponent();
        ((AuthorListPageVm)BindingContext).ScrollAuthorListAction += ScrollToAuthor;
	}

    /// <summary>
    /// 作家一覧の中から <paramref name="author"/> で指定した要素までジャンプ（スクロール）
    /// </summary>
    private void ScrollToAuthor(Author author)
    {
        authorListCollectionView.ScrollTo(author);
    }
}

public class AuthorListPageVm : VmBase
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
            OnPropertyChanged(nameof(AuthorList));
            OnPropertyChanged(nameof(InitialList));
        }
    }
    private string _searchText;

    /// <summary>
    /// 作者の名前リスト
    /// </summary>
	public List<Author> AuthorList =>
        GetSearchedList(SearchText).OrderBy(x => x.Reading).ToList();

    /// <summary>
    /// 名前の頭文字リスト
    /// </summary>
    public List<string> InitialList =>
        AuthorList.Select(x => x.Initial).Distinct().ToList();

    /// <summary>
    /// 作者一覧で選択された要素
    /// </summary>
	public Author SelectedAuthor
	{
		get => _selectedAuthor;
		set => SetProperty(ref _selectedAuthor, value);
	}
	private Author _selectedAuthor;

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
    public Action<Author> ScrollAuthorListAction { get; set; }

    public AuthorListPageVm()
    {
        OpenDetailCommand = new Command(async () =>
        {
            if (SelectedAuthor is null)
            {
                return;
            }

            //var page = new GalleryDetailPage(SelectedItem);
            //await Shell.Current.Navigation.PushAsync(page);
            SelectedAuthor = null;
        });

        SelectInitialCommand = new Command(() =>
        {
            if (SelectedInitial is null)
            {
                return;
            }

            var targetAuthor = AuthorList.FirstOrDefault(x => x.Initial == SelectedInitial);

            if (targetAuthor is null)
            {
                return;
            }

            ScrollAuthorListAction?.Invoke(targetAuthor);

            SelectedInitial = null;
        });
    }

    public static IEnumerable<Author> GetSearchedList(string searchText)
    {
        return StaticValues.Authors.Where(x => x.IsMatch(searchText));
    }
}