import 'package:flutter/material.dart';
import 'package:gap/gap.dart';
import 'package:intersperse/intersperse.dart';
import 'package:mobile/application/usecases/product_usecase.dart';
import 'package:mobile/models/product.dart';
import 'package:mobile/widgets/favorite_button.dart';
import 'package:mobile/widgets/thumb_interlace_image.dart';

class ProductDetailScreen extends StatefulWidget {
  const ProductDetailScreen({
    super.key,
    required this.product,
    required this.usecase,
  });

  final Product product;
  final ProductUsecase usecase;

  @override
  State<ProductDetailScreen> createState() => _ProductDetailScreenState();
}

class _ProductDetailScreenState extends State<ProductDetailScreen> {
  @override
  Widget build(BuildContext context) {
    final product = widget.product;
    final usecase = widget.usecase;

    return Scaffold(
      appBar: AppBar(
        title: Text(product.title),
        actions: [
          FavoriteButton(id: product.id, productUsecase: usecase),
        ],
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          ThumbInterlaceImage(imageBase: product),
          const Gap(8),
          Text(product.detail),
        ].intersperse(const Gap(8)).toList(),
      ),
    );
  }
}
