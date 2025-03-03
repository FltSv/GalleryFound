import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:gap/gap.dart';
import 'package:intersperse/intersperse.dart';
import 'package:mobile/models/creator.dart';
import 'package:mobile/models/exhibit.dart';
import 'package:mobile/models/product.dart';
import 'package:mobile/providers/data_provider.dart';
import 'package:mobile/providers/navigate_provider.dart';
import 'package:mobile/screens/exhibit_detail_screen.dart';
import 'package:mobile/screens/product_detail_screen.dart';
import 'package:mobile/screens/word_search_screen.dart';
import 'package:mobile/widgets/action_text.dart';
import 'package:mobile/widgets/empty_state.dart';
import 'package:mobile/widgets/exhibit_item.dart';
import 'package:mobile/widgets/linkable_text.dart';
import 'package:mobile/widgets/thumb_image.dart';
import 'package:url_launcher/url_launcher.dart';

class CreatorDetailScreen extends ConsumerWidget {
  const CreatorDetailScreen({super.key, required this.creator});

  final Creator creator;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final theme = Theme.of(context);
    final iconSize = theme.textTheme.bodyMedium?.fontSize ?? 16;

    final creatorUsecase = ref.watch(creatorUsecaseProvider);
    final productUsecase = ref.watch(productUsecaseProvider);

    return Scaffold(
      appBar: AppBar(
        title: Text(creator.name),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          if (creator.profile.isNotEmpty)
            LinkableText(
              text: creator.profile,
              onHashtagTap: (hashtag) {
                NavigateProvider.push(
                  context,
                  WordSearchScreen(
                    creators: DataProvider().creators,
                    query: hashtag,
                    searchFilter: (creators, query) =>
                        // ハッシュタグが含まれるクリエイターをフィルタリング
                        creators.where(
                      (creator) => creator.profileHashtags.contains(query),
                    ),
                  ),
                );
              },
              onUrlTap: _launchUrl,
              onEmailTap: (address) => _launchUrl('mailto:$address'),
            ),
          if (creator.links.isNotEmpty)
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: creator.links
                  .map<Widget>(
                    (link) => Row(
                      children: [
                        CachedNetworkImage(
                          imageUrl:
                              'http://www.google.com/s2/favicons?domain=$link',
                          width: iconSize,
                          height: iconSize,
                          fadeInDuration: const Duration(milliseconds: 100),
                          errorWidget: (context, url, error) => Icon(
                            Icons.public,
                            size: iconSize,
                            color: Colors.grey,
                          ),
                        ),
                        const Gap(4),
                        ActionText(
                          text: link,
                          onTap: () => _launchUrl(link),
                        ),
                      ],
                    ),
                  )
                  .intersperse(const Gap(8))
                  .toList(),
            ),
          if (creator.profile.isNotEmpty || creator.links.isNotEmpty)
            const Gap(8),
          Text(
            '展示歴',
            style: theme.textTheme.headlineMedium,
          ),
          FutureBuilder<List<Exhibit>>(
            future: creatorUsecase.fetchCreatorExhibits(creator),
            builder: (context, snapshot) {
              if (snapshot.connectionState == ConnectionState.waiting) {
                return const Center(child: CircularProgressIndicator());
              }

              final exhibits = snapshot.data;
              if (exhibits == null || exhibits.isEmpty) {
                return const EmptyState();
              }

              return Column(
                children: exhibits
                    .map<ExhibitItem>(
                      (exhibit) => ExhibitItem(exhibit: exhibit),
                    )
                    .map<Widget>(
                      (item) => GestureDetector(
                        onTap: () => NavigateProvider.push(
                          context,
                          ExhibitDetailScreen(exhibit: item.exhibit),
                        ),
                        child: item,
                      ),
                    )
                    .intersperse(const Gap(8))
                    .toList(),
              );
            },
          ),
          const Gap(8),
          Text(
            '発表作品',
            style: theme.textTheme.headlineMedium,
          ),
          FutureBuilder(
            future: creatorUsecase.fetchCreatorProducts(creator),
            builder: (context, snapshot) {
              if (snapshot.connectionState == ConnectionState.waiting) {
                return const Center(child: CircularProgressIndicator());
              }

              final products = snapshot.data;
              if (products == null || products.isEmpty) {
                return const EmptyState();
              }

              return GridView.count(
                crossAxisCount: 2,
                mainAxisSpacing: 8,
                crossAxisSpacing: 8,
                physics:
                    const NeverScrollableScrollPhysics(), // GridViewのスクロールを無効化
                shrinkWrap: true, // GridViewの高さをコンテンツに合わせる
                children: products
                    .map((product) => ProductItem(product: product))
                    .map<Widget>(
                      (item) => GestureDetector(
                        onTap: () => NavigateProvider.push(
                          context,
                          ProductDetailScreen(
                            product: item.product,
                            usecase: productUsecase,
                          ),
                        ),
                        child: item,
                      ),
                    )
                    .toList(),
              );
            },
          ),
        ].intersperse(const Gap(16)).toList(),
      ),
    );
  }

  Future<void> _launchUrl(String uri) async {
    final url = Uri.parse(uri);
    await launchUrl(
      url,
      mode: LaunchMode.externalApplication,
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
    return ThumbImage(imageBase: product);
  }
}
