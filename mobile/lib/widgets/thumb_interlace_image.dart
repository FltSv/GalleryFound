import 'dart:ui';

import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:mobile/models/image_base.dart';
import 'package:mobile/widgets/thumb_image.dart';

class ThumbInterlaceImage extends StatelessWidget {
  const ThumbInterlaceImage({
    required this.imageBase,
    super.key,
  });

  final ImageBase imageBase;

  @override
  Widget build(BuildContext context) {
    final blurColor = Theme.of(context).colorScheme.surface.withOpacity(0.2);

    return CachedNetworkImage(
      imageUrl: imageBase.imageUrl,
      placeholder: (context, url) => FittedBox(
        child: Stack(
          children: [
            ThumbImage(imageBase: imageBase),
            Positioned.fill(
              child: Stack(
                children: [
                  BackdropFilter(
                    filter: ImageFilter.blur(sigmaX: 1, sigmaY: 1),
                    child: Container(color: blurColor),
                  ),
                  const Center(child: CircularProgressIndicator()),
                ],
              ),
            ),
          ],
        ),
      ),
      errorWidget: (context, url, error) => const Icon(Icons.error),
    );
  }
}
