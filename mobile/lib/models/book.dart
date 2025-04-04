import 'package:mobile/models/creator.dart';

/// 書籍
class Book {
  Book({
    required this.id,
    required this.title,
    required this.image,
    required this.urls,
  });

  final String id;

  /// 書籍のタイトル
  final String title;

  /// 書籍のサムネイル画像のファイル名＋トークン
  final String image;
  String get imageUrl {
    // TODO(suna): implement fetchProducts
    throw UnimplementedError();
  }

  /// 書籍購入のリンク 複数ある場合も可
  final List<String> urls;

  late final Creator creator;
}
