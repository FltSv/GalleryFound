import 'dart:ui';

import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:mobile/widgets/thumb_image.dart';

class ThumbInterlaceImage extends StatelessWidget {
  final String? thumbURL;
  final String imageURL;

  const ThumbInterlaceImage({
    required this.thumbURL,
    required this.imageURL,
    super.key,
  });

  @override
  Widget build(BuildContext context) {
    final availThumb = thumbURL != null && thumbURL!.isNotEmpty;
    final blurColor = Theme.of(context).colorScheme.surface;

    return CachedNetworkImage(
      imageUrl: imageURL,
      placeholder: (context, url) => availThumb
          ? FittedBox(
              child: Stack(children: [
                ThumbImage(
                  thumbURL: thumbURL,
                  imageURL: imageURL,
                ),
                Positioned.fill(
                  child: Stack(children: [
                    BackdropFilter(
                      filter: ImageFilter.blur(sigmaX: 1, sigmaY: 1),
                      child: Container(color: blurColor.withOpacity(0.2)),
                    ),
                    Center(child: CircularProgressIndicator()),
                  ]),
                ),
              ]),
            )
          : Container(
              color: Colors.grey[300]?.withOpacity(0.5), // プレースホルダーの背景色
              padding: const EdgeInsets.all(16),
              child: Center(child: CircularProgressIndicator()),
            ),
      errorWidget: (context, url, error) => const Icon(Icons.error),
    );
  }
}
