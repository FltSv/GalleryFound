import 'package:mobile/infra/factory.dart';
import 'package:mobile/models/creator.dart';

/// データの取得と保持を行う
class DataProvider {
  // シングルトンのインスタンスを作成
  static final DataProvider _instance = DataProvider._internal();
  factory DataProvider() => _instance;
  DataProvider._internal();

  late List<Creator> _creators;
  List<Creator> get creators => _creators;

  late String Function(String userId, String image) _getImageUrl;
  String getImageUrl(String userId, String image) =>
      _getImageUrl(userId, image);

  /// データの取得
  Future<void> fetchData() async {
    final repo = Factory.getDataRepo();

    _getImageUrl = repo.getImageUrl;
    _creators = await repo.fetchCreators();
  }
}
