import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:mobile/models/image_base.dart';
import 'package:mobile/widgets/loading_placeholder.dart';

class ThumbImage extends StatelessWidget {
  const ThumbImage({
    required this.imageBase,
    super.key,
  });

  final ImageBase imageBase;

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<String?>(
      future: imageBase.thumbUrl,
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return const LoadingPlaceholder();
        }

        final resolvedThumbURL = snapshot.data;
        final availThumb =
            resolvedThumbURL != null && resolvedThumbURL.isNotEmpty;

        return CachedNetworkImage(
          imageUrl: availThumb ? resolvedThumbURL : imageBase.imageUrl,
          placeholder: (context, url) => const LoadingPlaceholder(),
          errorWidget: (context, url, error) => const Icon(Icons.error),
        );
      },
    );
  }
}
