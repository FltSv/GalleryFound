using GalleryFound.Models.Repositories;
using System.Collections;

namespace GalleryFound.Models.StaticValues;

/// <summary>
/// StaticValues各クラスの実装を補助する基底クラス
/// </summary>
public abstract class StaticValueBase<T> : IEnumerable<T>
{
    private object _lock = new();
    private T[] _innerCollection;

    /// <summary>
    /// リポジトリから値の取得を行う
    /// </summary>
    public abstract Task LoadValuesAsync(IRepo repo);

    /// <summary>
    /// 内部コレクションへ値を設定する
    /// </summary>
    protected void SetCollection(T[] innerCollection)
    {
        lock (_lock)
        {
            _innerCollection = innerCollection;
        }
    }

    #region IEnumerable<T> Implement

    public IEnumerator GetEnumerator()
    {
        lock (_lock)
        {
            return _innerCollection.GetEnumerator();
        }
    }

    IEnumerator<T> IEnumerable<T>.GetEnumerator()
    {
        lock (_lock)
        {
            return _innerCollection.Cast<T>().GetEnumerator();
        }
    }

    #endregion
}
