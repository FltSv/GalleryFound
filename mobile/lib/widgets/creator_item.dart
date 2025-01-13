import 'package:flutter/material.dart';
import 'package:mobile/models/creator.dart';
import 'package:mobile/widgets/thumb_image.dart';

class CreatorItem extends StatelessWidget {
  final Creator creator;
  final VoidCallback onTap;

  const CreatorItem({
    super.key,
    required this.creator,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final imageUrl = creator.highlightProduct?.imageUrl;
    final thumbUrl = creator.highlightProduct?.thumbUrl;

    return Card(
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(10.0),
      ),
      clipBehavior: Clip.antiAlias,
      child: GestureDetector(
        onTap: onTap,
        child: Stack(
          children: [
            // 背景画像またはプレースホルダー
            imageUrl != null
                ? ThumbImage(thumbURL: thumbUrl, imageURL: imageUrl)
                : Container(
                    color: Colors.grey[300], // プレースホルダーの背景色
                    child: Center(
                      child: Icon(
                        Icons.image_not_supported,
                        size: 50,
                        color: Colors.grey[500],
                      ),
                    ),
                  ),
            // シャドウグラデーション
            Positioned(
              bottom: 0,
              left: 0,
              right: 0,
              child: Container(
                height: 100,
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topCenter,
                    end: Alignment.bottomCenter,
                    colors: [
                      Colors.transparent,
                      Colors.black.withOpacity(0.8),
                    ],
                  ),
                ),
              ),
            ),
            // テキスト表示
            Positioned(
              bottom: 10.0,
              left: 10.0,
              child: Text(
                creator.name,
                style: Theme.of(context)
                    .textTheme
                    .titleMedium
                    ?.copyWith(color: Colors.white),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
