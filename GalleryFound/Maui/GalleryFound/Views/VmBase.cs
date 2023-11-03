using System.ComponentModel;
using System.Runtime.CompilerServices;

namespace GalleryFound.Views;

/// <summary>
/// ViewModelの基底クラス
/// </summary>
public abstract class VmBase : INotifyPropertyChanged
{
    public event PropertyChangedEventHandler PropertyChanged;

    public INavigation Navigation { get; set; }

    protected bool SetProperty<T>(ref T field, T value, [CallerMemberName] string propertyName = null)
    {
        if (Equals(field, value))
        {
            return false;
        }

        field = value;
        PropertyChanged?.Invoke(this, new(propertyName));

        return true;
    }

    protected void OnPropertyChanged([CallerMemberName] string caller = null) =>
        PropertyChanged?.Invoke(this, new(caller));
}
