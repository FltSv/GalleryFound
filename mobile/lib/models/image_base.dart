import 'package:mobile/models/creator.dart';
import 'package:mobile/providers/data_provider.dart';

class ImageBase {
  ImageBase({
    required this.image,
    required this.fetchThumbUrl,
  });

  /// 作品のサムネイル画像のファイル名＋トークン
  final String image;
  String get imageUrl => DataProvider().getImageUrl(creator.id, image);

  late final String? _thumbUrl;
  bool _isInitializedThumbUrl = false;
  final Future<String?> Function(String userId, String image) fetchThumbUrl;

  /// サムネイル画像のURL
  Future<String?> get thumbUrl async {
    if (_isInitializedThumbUrl) {
      return _thumbUrl;
    }

    final url = await fetchThumbUrl(creator.id, image);
    _thumbUrl = url;
    _isInitializedThumbUrl = true;
    return url;
  }

  late final Creator creator;
}
