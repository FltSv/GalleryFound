import 'package:mobile/models/product.dart';
import 'package:mobile/models/exhibit.dart';

class Creator {
  Creator({
    required this.id,
    required this.name,
    required this.products,
    required this.exhibits,
  });

  final String id;

  /// 作家名
  final String name;

  /// 作品一覧
  final List<Product> products;

  /// 展示歴一覧
  final List<Exhibit> exhibits;
}
