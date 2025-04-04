import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:mobile/application/usecases/creator_usecase.dart';
import 'package:mobile/application/usecases/exhibit_usecase.dart';
import 'package:mobile/application/usecases/product_usecase.dart';
import 'package:mobile/infra/factory.dart';
import 'package:mobile/infra/fake/fake_repo.dart';
import 'package:mobile/infra/shared_preferences/shared_pref_user_data_repo.dart';
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

  late final String _storageImageBaseUrl;
  String get storageImageBaseUrl => _storageImageBaseUrl;

  /// データの取得
  Future<void> fetchData() async {
    final repo = Factory.getDataRepo();

    _creators = await repo.fetchCreators();
    _galleries = await repo.fetchGalleries();
    _storageImageBaseUrl = repo.storageImageBaseUrl;
    _books = await FakeRepo.fetchBooks();
  }
}

final dataRepoProvider = Provider((ref) => Factory.getDataRepo());
final userDataRepoProvider = Provider((ref) => SharedPrefUserDataRepo());

final creatorUsecaseProvider =
    Provider((ref) => CreatorUsecase(ref.read(dataRepoProvider)));

final exhibitUsecaseProvider =
    Provider((ref) => ExhibitUsecase(ref.read(dataRepoProvider)));

final productUsecaseProvider = Provider(
  (ref) => ProductUsecase(
    dataRepo: ref.read(dataRepoProvider),
    userDataRepo: ref.read(userDataRepoProvider),
  ),
);

final isFavoriteProvider = FutureProvider.family<bool, String>((ref, id) async {
  final usecase = ref.watch(productUsecaseProvider);
  return usecase.isFavorite(id);
});
