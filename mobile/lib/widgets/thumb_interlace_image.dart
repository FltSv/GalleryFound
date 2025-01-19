import 'dart:ui';

import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:mobile/models/image_base.dart';
import 'package:mobile/widgets/loading_placeholder.dart';
import 'package:mobile/widgets/thumb_image.dart';

class ThumbInterlaceImage extends StatelessWidget {
  const ThumbInterlaceImage({
    required this.imageBase,
    super.key,
  });

  final ImageBase imageBase;

  @override
  Widget build(BuildContext context) {
    final blurColor = Theme.of(context).colorScheme.surface;

    return FutureBuilder(
      future: imageBase.thumbUrl,
      builder: (context, snapshot) {
        final resolvedThumbnailUrl = snapshot.data;
        final availThumb =
            resolvedThumbnailUrl != null && resolvedThumbnailUrl.isNotEmpty;

        return CachedNetworkImage(
          imageUrl: imageBase.imageUrl,
          placeholder: (context, url) => availThumb
              ? FittedBox(
                  child: Stack(
                    children: [
                      ThumbImage(imageBase: imageBase),
                      Positioned.fill(
                        child: Stack(
                          children: [
                            BackdropFilter(
                              filter: ImageFilter.blur(sigmaX: 1, sigmaY: 1),
                              child:
                                  Container(color: blurColor.withOpacity(0.2)),
                            ),
                            const Center(child: CircularProgressIndicator()),
                          ],
                        ),
                      ),
                    ],
                  ),
                )
              : const LoadingPlaceholder(),
          errorWidget: (context, url, error) => const Icon(Icons.error),
        );
      },
    );
  }
}
