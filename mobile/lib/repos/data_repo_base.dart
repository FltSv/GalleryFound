import 'package:mobile/models/creator.dart';
import 'package:mobile/models/exhibit.dart';
import 'package:mobile/models/gallery.dart';
import 'package:mobile/models/product.dart';

abstract class DataRepoBase {
  /// 全クリエイター一覧を取得
  Future<List<Creator>> fetchCreators();

  /// 全ギャラリー一覧を取得
  Future<List<Gallery>> fetchGalleries();

  /// 指定IDのギャラリーを取得
  Future<Gallery> fetchGalleryById(String galleryId);

  /// Storageの画像パスの先頭共通部分
  String get storageImageBaseUrl;

  Future<List<Product>> fetchCreatorProducts(Creator creator);
  Future<List<Exhibit>> fetchCreatorExhibits(Creator creator);

  /// 指定日時以降の展示一覧を取得
  Future<List<Exhibit>> fetchExhibitsAfterDate(
    DateTime date,
    List<Creator> creators,
  );

  /// 作品一覧を取得
  Future<List<Product>> fetchProducts({
    required List<Creator> creators,
    required int limit,
    Product? lastProduct,
  });
}
