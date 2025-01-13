import 'package:mobile/models/product.dart';
import 'package:mobile/models/exhibit.dart';

class Creator {
  Creator({
    required this.id,
    required this.name,
    required this.genre,
    required this.profile,
    required this.profileHashtags,
    required this.links,
    required this.highlightProduct,
    required this.products,
    required this.exhibits,
  }) {
    for (final product in products) {
      product.creator = this;
    }
    for (final exhibit in exhibits) {
      exhibit.creator = this;
    }
  }

  final String id;

  /// 作家名
  final String name;

  /// ジャンル
  final String? genre;

  /// プロフィール
  final String profile;

  /// プロフィールに含まれるハッシュタグ
  final List<String> profileHashtags;

  /// SNSリンク
  final List<String> links;

  /// 代表作品
  final Product? highlightProduct;

  /// 作品一覧
  final List<Product> products;

  /// 展示歴一覧
  final List<Exhibit> exhibits;
}
