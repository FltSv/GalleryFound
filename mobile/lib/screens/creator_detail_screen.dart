import 'package:flutter/material.dart';
import 'package:gap/gap.dart';
import 'package:intersperse/intersperse.dart';
import 'package:mobile/models/creator.dart';
import 'package:mobile/models/exhibit.dart';
import 'package:mobile/models/product.dart';
import 'package:mobile/providers/data_provider.dart';

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
          Text(
            '展示歴',
            style: theme.textTheme.headlineMedium,
          ),
          Column(
            children: creator.exhibits
                .map<Widget>((exhibit) => ExhibitItem(
                      exhibit: exhibit,
                      creatorId: creator.id,
                    ))
                .intersperse(const Gap(8))
                .toList(),
          ),
          const Gap(8),
          Text(
            '発表作品',
            style: theme.textTheme.headlineMedium,
          ),
          GridView.count(
            crossAxisCount: 2,
            mainAxisSpacing: 8,
            crossAxisSpacing: 8,
            physics: const NeverScrollableScrollPhysics(), // GridViewのスクロールを無効化
            shrinkWrap: true, // GridViewの高さをコンテンツに合わせる
            children: creator.products
                .map((product) => ProductItem(
                      product: product,
                      creatorId: creator.id,
                    ))
                .toList(),
          ),
        ].intersperse(const Gap(16)).toList(),
      ),
    );
  }
}

class ExhibitItem extends StatelessWidget {
  const ExhibitItem({
    super.key,
    required this.exhibit,
    required this.creatorId,
  });

  final Exhibit exhibit;
  final String creatorId;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Expanded(
          flex: 3,
          child: Image.network(
              DataProvider().getImageUrl(creatorId, exhibit.image)),
        ),
        Expanded(
          flex: 4,
          child: Padding(
            padding: const EdgeInsets.all(8),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  exhibit.title,
                  style: theme.textTheme.titleMedium,
                ),
                const Gap(0),
                Text(exhibit.location),
                Text(exhibit.displayDate),
              ].intersperse(const Gap(4)).toList(),
            ),
          ),
        ),
      ],
    );
  }
}

class ProductItem extends StatelessWidget {
  const ProductItem({
    super.key,
    required this.product,
    required this.creatorId,
  });

  final Product product;
  final String creatorId;

  @override
  Widget build(BuildContext context) {
    final String imageUrl =
        DataProvider().getImageUrl(creatorId, product.image);
    return Image.network(imageUrl);
  }
}
