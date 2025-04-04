import 'package:mobile/models/creator.dart';
import 'package:mobile/providers/data_provider.dart';

class ImageBase {
  ImageBase({
    required this.imagePath,
    required this.thumbPath,
  });

  /// Storageのcreators/以下を格納する画像パス
  ///
  /// @example
  /// `{creatorId}%2F{imageId}.png?alt=media&token={token}`
  final String imagePath;

  String get imageUrl => DataProvider().storageImageBaseUrl + imagePath;

  /// Storageのcreators/以下を格納するサムネイル画像パス
  ///
  /// @example
  /// `{creatorId}%2F{imageId}.png?alt=media&token={token}`
  final String thumbPath;

  /// サムネイル画像のURL
  String get thumbUrl => DataProvider().storageImageBaseUrl + thumbPath;

  late final Creator creator;
}
