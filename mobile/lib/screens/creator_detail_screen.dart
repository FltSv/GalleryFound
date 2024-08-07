import 'package:flutter/material.dart';
import 'package:gap/gap.dart';
import 'package:intersperse/intersperse.dart';
import 'package:mobile/models/creator.dart';
import 'package:mobile/models/product.dart';
import 'package:mobile/widgets/empty_state.dart';
import 'package:mobile/widgets/exhibit_item.dart';

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
          if (creator.exhibits.isEmpty) const EmptyState(),
          Column(
            children: creator.exhibits
                .map<Widget>((exhibit) => ExhibitItem(exhibit: exhibit))
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
    return Image.network(product.imageUrl);
  }
}
