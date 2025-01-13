import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';

class ThumbImage extends StatelessWidget {
  final String? thumbURL;
  final String imageURL;

  const ThumbImage({
    required this.thumbURL,
    required this.imageURL,
    super.key,
  });

  @override
  Widget build(BuildContext context) {
    final availThumb = thumbURL != null && thumbURL!.isNotEmpty;

    return CachedNetworkImage(
      imageUrl: availThumb ? thumbURL! : imageURL,
      placeholder: (context, url) => Container(
        color: Colors.grey[300]?.withOpacity(0.5), // プレースホルダーの背景色
        padding: const EdgeInsets.all(16),
        child: const Center(
          child: CircularProgressIndicator(),
        ),
      ),
      errorWidget: (context, url, error) => const Icon(Icons.error),
    );
  }
}
