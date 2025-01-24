import 'package:mobile/models/image_base.dart';

/// 作品
class Product extends ImageBase {
  Product({
    required this.id,
    required this.title,
    required this.detail,
    required super.image,
    required super.fetchThumbUrl,
  });

  final String id;

  /// 作品名
  final String title;

  /// 作品詳細、他
  final String detail;
}
