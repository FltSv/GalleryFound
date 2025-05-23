import 'package:flutter/material.dart';
import 'package:gap/gap.dart';
import 'package:intersperse/intersperse.dart';
import 'package:mobile/models/product.dart';
import 'package:mobile/widgets/creator_link.dart';
import 'package:mobile/widgets/favorite_button.dart';
import 'package:mobile/widgets/linkable_text.dart';
import 'package:mobile/widgets/thumb_interlace_image.dart';
import 'package:url_launcher/url_launcher.dart';

class ProductDetailScreen extends StatelessWidget {
  const ProductDetailScreen({
    super.key,
    required this.product,
  });

  final Product product;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(product.title),
        actions: [
          FavoriteButton(id: product.id),
        ],
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          ThumbInterlaceImage(imageBase: product),
          const Gap(8),
          LinkableText(
            text: product.detail,
            onUrlTap: (url) {
              launchUrl(
                Uri.parse(url),
                mode: LaunchMode.externalApplication,
              );
            },
          ),
          CreatorLink(creator: product.creator),
        ].intersperse(const Gap(8)).toList(),
      ),
    );
  }
}
