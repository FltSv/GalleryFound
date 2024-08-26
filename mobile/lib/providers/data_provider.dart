import 'package:mobile/infra/factory.dart';
import 'package:mobile/infra/fake/fake_repo.dart';
import 'package:mobile/models/book.dart';
import 'package:mobile/models/creator.dart';

/// データの取得と保持を行う
class DataProvider {
  // シングルトンのインスタンスを作成
  static final DataProvider _instance = DataProvider._internal();
  factory DataProvider() => _instance;
  DataProvider._internal();

  late List<Creator> _creators;
  List<Creator> get creators => _creators;

  late List<Book> _books;
  List<Book> get books => _books;

  late String Function(String userId, String image) _getImageUrl;
  String getImageUrl(String userId, String image) =>
      _getImageUrl(userId, image);

  /// データの取得
  Future<void> fetchData() async {
    final repo = Factory.getDataRepo();

    _getImageUrl = repo.getImageUrl;
    _creators = await repo.fetchCreators();
    _books = await FakeRepo.fetchBooks();
  }
}
