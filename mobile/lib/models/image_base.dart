import 'package:mobile/models/creator.dart';
import 'package:mobile/providers/data_provider.dart';

class ImageBase {
  ImageBase({
    required this.imagePath,
    required this.thumbPath,
    required this.creatorId,
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

  /// アイテムを所有するCreatorのID
  final String creatorId;

  /// アイテムを所有するCreator
  Creator get creator => DataProvider().creators.firstWhere(
        (creator) => creator.id == creatorId,
        orElse: () => throw Exception('Creator "$creatorId" not found.'),
      );
}
