import 'package:mobile/models/creator.dart';
import 'package:mobile/providers/data_provider.dart';

/// 作品
class Product {
  Product({
    required this.id,
    required this.image,
  });

  final String id;

  /// 作品のサムネイル画像のファイル名＋トークン
  final String image;
  String get imageUrl => DataProvider().getImageUrl(creator.id, image);

  late final Creator creator;
}
