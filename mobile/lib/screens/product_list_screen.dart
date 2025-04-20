import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:infinite_scroll_pagination/infinite_scroll_pagination.dart';
import 'package:mobile/application/usecases/product_usecase.dart';
import 'package:mobile/models/product.dart';
import 'package:mobile/providers/data_provider.dart';
import 'package:mobile/providers/navigate_provider.dart';
import 'package:mobile/screens/creator_detail_screen.dart';
import 'package:mobile/screens/product_detail_screen.dart';

class ProductListScreen extends ConsumerStatefulWidget {
  const ProductListScreen({super.key});

  @override
  ConsumerState createState() => _ProductListScreenState();
}

class _ProductListScreenState extends ConsumerState<ProductListScreen> {
  static const int pageSize = 20;

  final Map<int, Product> productsIndex = {};

  late final ProductUsecase usecase = ref.read(productUsecaseProvider);
  late final PagingController<int, Product> controller = PagingController(
    getNextPageKey: (state) {
      if (hasReachedEnd) {
        return null;
      }

      return (state.keys?.last ?? 0) + 1;
    },
    fetchPage: (pageKey) async {
      final lastProduct = pageKey <= 1 ? null : productsIndex[pageKey - 1];
      final items = await usecase.fetch(
        limit: pageSize,
        lastProduct: lastProduct,
      );

      if (items.length < pageSize) {
        hasReachedEnd = true;
        return items;
      }

      productsIndex[pageKey] = items.last;
      return items;
    },
  );

  /// 最後のページに到達したかどうか
  bool hasReachedEnd = false;

  @override
  void dispose() {
    controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('作品一覧'),
      ),
      body: PagingListener(
        controller: controller,
        builder: (context, state, fetchNextPage) =>
            PagedMasonryGridView<int, Product>.count(
          state: state,
          fetchNextPage: fetchNextPage,
          builderDelegate: PagedChildBuilderDelegate(
            itemBuilder: (context, product, _) => _KeepAliveItem(product),
            firstPageErrorIndicatorBuilder: (context) =>
                _FirstPageErrorIndicator(error: controller.error),
          ),
          crossAxisCount: 2,
          mainAxisSpacing: 2,
          crossAxisSpacing: 2,
        ),
      ),
    );
  }
}

class _FirstPageErrorIndicator extends StatelessWidget {
  const _FirstPageErrorIndicator({required this.error});

  final Object? error;

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.error_outline,
              color: Theme.of(context).colorScheme.error,
              size: 48,
            ),
            const SizedBox(height: 16),
            Text(
              '問題が発生しました',
              style: Theme.of(context).textTheme.titleLarge,
            ),
            const SizedBox(height: 8),
            Text(
              'データの読み込み中に予期せぬエラーが発生しました。しばらくしてからもう一度お試しください。',
              style: Theme.of(context).textTheme.bodyMedium,
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 16),
            Text(
              'エラー詳細:',
              style: Theme.of(context)
                  .textTheme
                  .labelSmall
                  ?.copyWith(fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 4),
            Text(
              error.toString(),
              style: Theme.of(context).textTheme.labelSmall,
              textAlign: TextAlign.left,
              maxLines: 5,
              overflow: TextOverflow.ellipsis,
            ),
          ],
        ),
      ),
    );
  }
}

class _KeepAliveItem extends StatefulWidget {
  const _KeepAliveItem(this.product);

  final Product product;

  @override
  State<_KeepAliveItem> createState() => _KeepAliveItemState();
}

class _KeepAliveItemState extends State<_KeepAliveItem>
    with AutomaticKeepAliveClientMixin {
  @override
  bool get wantKeepAlive => true;

  @override
  Widget build(BuildContext context) {
    super.build(context);

    return GestureDetector(
      onTap: () {
        NavigateProvider.push(
          context,
          ProductDetailScreen(product: widget.product),
        );
      },
      child: Card(
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(10),
        ),
        clipBehavior: Clip.antiAlias,
        child: ProductItem(product: widget.product),
      ),
    );
  }
}
