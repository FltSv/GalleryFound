import 'package:mobile/models/favorite_id.dart';
import 'package:mobile/models/product.dart';
import 'package:mobile/models/user_data.dart';
import 'package:mobile/providers/data_provider.dart';
import 'package:mobile/repos/data_repo_base.dart';
import 'package:mobile/repos/user_data_repo_base.dart';

class ProductUsecase {
  ProductUsecase({
    required this.dataRepo,
    required this.userDataRepo,
  });

  final DataRepoBase dataRepo;
  final UserDataRepoBase userDataRepo;

  Future<List<Product>> fetch({int limit = 10, Product? lastProduct}) {
    return dataRepo.fetchProducts(
      creators: DataProvider().creators,
      limit: limit,
      lastProduct: lastProduct,
    );
  }

  Future<List<FavoriteId>> getFavorites() async {
    final data = await userDataRepo.fetch();
    return data.favorites;
  }

  Future<void> toggleFavorite(String id) async {
    final data = await userDataRepo.fetch();
    final favorites = data.favorites;

    if (favorites.any((f) => f.id == id)) {
      favorites.removeWhere((f) => f.id == id);
    } else {
      favorites.add(FavoriteId(id: id));
    }

    await userDataRepo.save(
      UserData(favorites: favorites, isDevelopDB: data.isDevelopDB),
    );
  }

  Future<bool> isFavorite(String id) async {
    final data = await userDataRepo.fetch();
    return data.favorites.any((favId) => favId.id == id);
  }
}
