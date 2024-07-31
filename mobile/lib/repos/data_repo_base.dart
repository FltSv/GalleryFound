import 'package:mobile/models/creator.dart';

abstract class DataRepoBase {
  Future<List<Creator>> fetchCreators();

  /// 画像URLを取得する
  ///
  /// - [userId] : クリエイターのユーザーID
  /// - [image] : DBのファイル名＋トークン
  String getImageUrl(String userId, String image);
}
