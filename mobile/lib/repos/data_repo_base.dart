import 'package:mobile/models/creator.dart';
import 'package:mobile/models/gallery.dart';

abstract class DataRepoBase {
  Future<List<Creator>> fetchCreators();

  Future<List<Gallery>> fetchGalleries();

  /// 画像URLを取得する
  ///
  /// - [userId] : クリエイターのユーザーID
  /// - [image] : DBのファイル名＋トークン
  String getImageUrl(String userId, String image);

  /// サムネイル画像URLを取得
  Future<String?> getThumbUrl(String userId, String image);
}
