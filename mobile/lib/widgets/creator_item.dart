import 'package:flutter/material.dart';
import 'package:mobile/models/creator.dart';
import 'package:mobile/widgets/empty_image_placeholder.dart';
import 'package:mobile/widgets/thumb_image.dart';

class CreatorItem extends StatelessWidget {
  const CreatorItem({
    super.key,
    required this.creator,
  });

  final Creator creator;

  @override
  Widget build(BuildContext context) {
    final product = creator.highlightProduct;

    return Card(
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(10),
      ),
      clipBehavior: Clip.antiAlias,
      child: Stack(
        children: [
          // 背景画像またはプレースホルダー
          product != null
              ? ThumbImage(imageBase: product)
              : const EmptyImagePlaceholder(),
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
            bottom: 10,
            left: 10,
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
    );
  }
}
