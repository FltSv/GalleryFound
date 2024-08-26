import 'package:mobile/models/product.dart';
import 'package:mobile/models/exhibit.dart';

class Creator {
  Creator({
    required this.id,
    required this.name,
    required this.profile,
    required this.links,
    required this.products,
    required this.exhibits,
  }) {
    for (var product in products) {
      product.creator = this;
    }
    for (var exhibit in exhibits) {
      exhibit.creator = this;
    }
  }

  final String id;

  /// 作家名
  final String name;

  /// プロフィール
  final String profile;

  /// SNSリンク
  final List<String> links;

  /// 作品一覧
  final List<Product> products;

  /// 展示歴一覧
  final List<Exhibit> exhibits;
}
