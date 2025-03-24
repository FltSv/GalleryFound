import 'package:mobile/models/creator.dart';
import 'package:mobile/providers/data_provider.dart';

class ImageBase {
  ImageBase({
    required this.image,
    required this.fetchThumbUrl,
    required this.imagePath,
    required this.thumbPath,
  });

  /// 作品のサムネイル画像のファイル名＋トークン
  final String image;

  /// Storageのcreators/以下を格納する画像パス
  ///
  /// @example
  /// `{creatorId}%2F{imageId}.png?alt=media&token={token}`
  final String? imagePath;

  String get imageUrl {
    if (imagePath?.isNotEmpty == true) {
      return DataProvider().storageImageBaseUrl + imagePath!;
    }

    return DataProvider().getImageUrl(creator.id, image);
  }

  late final String? _thumbUrl;
  bool _isInitializedThumbUrl = false;
  final Future<String?> Function(String userId, String image) fetchThumbUrl;

  /// Storageのcreators/以下を格納するサムネイル画像パス
  ///
  /// @example
  /// `{creatorId}%2F{imageId}.png?alt=media&token={token}`
  final String? thumbPath;

  /// サムネイル画像のURL
  Future<String?> get thumbUrl async {
    if (_isInitializedThumbUrl) {
      return _thumbUrl;
    }

    if (thumbPath?.isNotEmpty == true) {
      final url = DataProvider().storageImageBaseUrl + thumbPath!;
      _thumbUrl = url;
      _isInitializedThumbUrl = true;
      return url;
    }

    final url = await fetchThumbUrl(creator.id, image);
    _thumbUrl = url;
    _isInitializedThumbUrl = true;
    return url;
  }

  late final Creator creator;
}
