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
    /// ��ƈꗗ�̒����� <paramref name="author"/> �Ŏw�肵���v�f�܂ŃW�����v�i�X�N���[���j
    /// </summary>
    private void ScrollToAuthor(Author author)
    {
        authorListCollectionView.ScrollTo(author);
    }
}

public class AuthorListPageVm : VmBase
{
    /// <summary>
    /// �����{�b�N�X�ɓ��͂��ꂽ�e�L�X�g
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
    /// ��҂̖��O���X�g
    /// </summary>
	public List<Author> AuthorList =>
        GetSearchedList(SearchText).OrderBy(x => x.Reading).ToList();

    /// <summary>
    /// ���O�̓��������X�g
    /// </summary>
    public List<string> InitialList =>
        AuthorList.Select(x => x.Initial).Distinct().ToList();

    /// <summary>
    /// ��҈ꗗ�őI�����ꂽ�v�f
    /// </summary>
	public Author SelectedAuthor
	{
		get => _selectedAuthor;
		set => SetProperty(ref _selectedAuthor, value);
	}
	private Author _selectedAuthor;

    /// <summary>
    /// ��҂̏ڍׂ��J���R�}���h
    /// </summary>
    public ICommand OpenDetailCommand { get; }

    /// <summary>
    /// �������ꗗ�őI�����ꂽ�v�f
    /// </summary>
    public string SelectedInitial
    {
        get => _selectedInitial;
        set => SetProperty(ref _selectedInitial, value);
    }
    private string _selectedInitial;

    /// <summary>
    /// ��������I���������Ɏ��s����R�}���h
    /// </summary>
    public ICommand SelectInitialCommand { get; }

    /// <summary>
    /// ��҃��X�g�̃X�N���[�����s�����\�b�h���i�[���Ă���
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