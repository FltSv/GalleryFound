import 'package:mobile/models/creator.dart';
import 'package:mobile/providers/data_provider.dart';

/// 作品
class Product {
  Product({
    required this.id,
    required this.title,
    required this.detail,
    required this.image,
    required this.thumbUrl,
  });

  final String id;

  /// 作品名
  final String title;

  /// 作品詳細、他
  final String detail;

  /// 作品のサムネイル画像のファイル名＋トークン
  final String image;
  String get imageUrl => DataProvider().getImageUrl(creator.id, image);

  /// サムネイル画像のURL
  final String? thumbUrl;

  late final Creator creator;
}
