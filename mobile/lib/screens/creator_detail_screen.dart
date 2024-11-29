import 'package:flutter/material.dart';
import 'package:gap/gap.dart';
import 'package:intersperse/intersperse.dart';
import 'package:mobile/models/creator.dart';
import 'package:mobile/models/product.dart';
import 'package:mobile/providers/navigate_provider.dart';
import 'package:mobile/screens/exhibit_detail_screen.dart';
import 'package:mobile/screens/product_detail_screen.dart';
import 'package:mobile/widgets/empty_state.dart';
import 'package:mobile/widgets/exhibit_item.dart';
import 'package:mobile/widgets/link_text.dart';
import 'package:mobile/widgets/thumb_image.dart';
import 'package:url_launcher/url_launcher.dart';

class CreatorDetailScreen extends StatefulWidget {
  const CreatorDetailScreen({super.key, required this.creator});

  final Creator creator;

  @override
  State<CreatorDetailScreen> createState() => _CreatorDetailScreenState();
}

class _CreatorDetailScreenState extends State<CreatorDetailScreen> {
  @override
  Widget build(BuildContext context) {
    final creator = widget.creator;
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(
        title: Text(creator.name),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          if (creator.profile.isNotEmpty) Text(creator.profile),
          if (creator.links.isNotEmpty)
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: creator.links
                  .map<Widget>((link) => Row(
                        children: [
                          Image.network(
                            "http://www.google.com/s2/favicons?domain=$link",
                            width: theme.textTheme.bodyMedium?.fontSize ?? 16,
                            height: theme.textTheme.bodyMedium?.fontSize ?? 16,
                          ),
                          const Gap(4),
                          LinkText(
                              text: link,
                              onTap: () async {
                                final url = Uri.parse(link);
                                await launchUrl(url,
                                    mode: LaunchMode.externalApplication);
                              }),
                        ],
                      ))
                  .intersperse(const Gap(8))
                  .toList(),
            ),
          if (creator.profile.isNotEmpty || creator.links.isNotEmpty)
            const Gap(8),
          Text(
            '展示歴',
            style: theme.textTheme.headlineMedium,
          ),
          if (creator.exhibits.isEmpty) const EmptyState(),
          Column(
            children: creator.exhibits
                .map<ExhibitItem>((exhibit) => ExhibitItem(exhibit: exhibit))
                .map<Widget>((item) => GestureDetector(
                      onTap: () => NavigateProvider.push(
                          context, ExhibitDetailScreen(exhibit: item.exhibit)),
                      child: item,
                    ))
                .intersperse(const Gap(8))
                .toList(),
          ),
          const Gap(8),
          Text(
            '発表作品',
            style: theme.textTheme.headlineMedium,
          ),
          if (creator.products.isEmpty) const EmptyState(),
          GridView.count(
            crossAxisCount: 2,
            mainAxisSpacing: 8,
            crossAxisSpacing: 8,
            physics: const NeverScrollableScrollPhysics(), // GridViewのスクロールを無効化
            shrinkWrap: true, // GridViewの高さをコンテンツに合わせる
            children: creator.products
                .map((product) => ProductItem(product: product))
                .map<Widget>((item) => GestureDetector(
                      onTap: () => NavigateProvider.push(
                          context, ProductDetailScreen(product: item.product)),
                      child: item,
                    ))
                .toList(),
          ),
        ].intersperse(const Gap(16)).toList(),
      ),
    );
  }
}

class ProductItem extends StatelessWidget {
  const ProductItem({
    super.key,
    required this.product,
  });

  final Product product;

  @override
  Widget build(BuildContext context) {
    return ThumbImage(
      thumbURL: product.thumbUrl,
      imageURL: product.imageUrl,
    );
  }
}
