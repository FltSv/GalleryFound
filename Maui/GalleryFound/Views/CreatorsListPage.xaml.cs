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
    /// ��ƈꗗ�̒����� <paramref name="creator"/> �Ŏw�肵���v�f�܂ŃW�����v�i�X�N���[���j
    /// </summary>
    private void ScrollToCreator(Creator creator)
    {
        creatorListCollectionView.ScrollTo(creator);
    }
}

public class CreatorListPageVm : VmBase
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
            OnPropertyChanged(nameof(CreatorList));
            OnPropertyChanged(nameof(InitialList));
        }
    }
    private string _searchText = string.Empty;

    /// <summary>
    /// ��҂̖��O���X�g
    /// </summary>
	public List<Creator> CreatorList =>
        GetSearchedList(SearchText).OrderBy(x => x.Reading).ToList();

    /// <summary>
    /// ���O�̓��������X�g
    /// </summary>
    public List<string> InitialList =>
        CreatorList.Select(x => x.Initial).Distinct().ToList();

    /// <summary>
    /// ��҈ꗗ�őI�����ꂽ�v�f
    /// </summary>
	public Creator SelectedCreator
	{
		get => _selectedCreator;
		set => SetProperty(ref _selectedCreator, value);
	}
	private Creator _selectedCreator;

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