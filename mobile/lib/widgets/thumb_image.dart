import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:mobile/models/image_base.dart';
import 'package:mobile/widgets/loading_placeholder.dart';

class ThumbImage extends StatelessWidget {
  const ThumbImage({
    required this.imageBase,
    this.fit,
    super.key,
  });

  final ImageBase imageBase;
  final BoxFit? fit;

  @override
  Widget build(BuildContext context) {
    final resolvedThumbURL = imageBase.thumbUrl;
    final availThumb = resolvedThumbURL.isNotEmpty;

    return CachedNetworkImage(
      imageUrl: availThumb ? resolvedThumbURL : imageBase.imageUrl,
      placeholder: (context, url) => const LoadingPlaceholder(),
      errorWidget: (context, url, error) => const Icon(Icons.error),
      fit: fit,
    );
  }
}
