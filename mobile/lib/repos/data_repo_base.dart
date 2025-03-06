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

  /// 画像URLを取得する
  ///
  /// - [userId] : クリエイターのユーザーID
  /// - [image] : DBのファイル名＋トークン
  String getImageUrl(String userId, String image);

  /// サムネイル画像URLを取得
  Future<String?> getThumbUrl(String userId, String image);

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
