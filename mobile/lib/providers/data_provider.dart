import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:mobile/application/usecases/creator_usecase.dart';
import 'package:mobile/infra/factory.dart';
import 'package:mobile/infra/fake/fake_repo.dart';
import 'package:mobile/models/book.dart';
import 'package:mobile/models/creator.dart';
import 'package:mobile/models/gallery.dart';

/// データの取得と保持を行う
class DataProvider {
  factory DataProvider() => _instance;
  DataProvider._internal();

  // シングルトンのインスタンスを作成
  static final DataProvider _instance = DataProvider._internal();

  late List<Creator> _creators;
  List<Creator> get creators => _creators;

  late List<Gallery> _galleries;
  List<Gallery> get galleries => _galleries;

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
    _galleries = await repo.fetchGalleries();
    _books = await FakeRepo.fetchBooks();
  }
}

final dataRepoProvider = Provider((ref) => Factory.getDataRepo());

final creatorUsecaseProvider =
    Provider((ref) => CreatorUsecase(ref.read(dataRepoProvider)));
