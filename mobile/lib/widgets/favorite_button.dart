import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:mobile/providers/data_provider.dart';

class FavoriteButton extends ConsumerStatefulWidget {
  const FavoriteButton({
    super.key,
    required this.id,
  });

  final String id;

  @override
  ConsumerState createState() => _FavoriteButtonState();
}

class _FavoriteButtonState extends ConsumerState<FavoriteButton> {
  @override
  Widget build(BuildContext context) {
    final usecase = ref.watch(productUsecaseProvider);
    final isFavorite = ref.watch(isFavoriteProvider(widget.id));

    return IconButton(
      icon: isFavorite.when(
        data: _buildFavoriteIcon,
        loading: () => const CircularProgressIndicator(), // ローディング時
        error: (_, __) => _buildFavoriteIcon(false), // エラー時はお気に入り解除扱い
      ),
      onPressed: () async {
        await HapticFeedback.lightImpact();
        await usecase.toggleFavorite(widget.id);
        ref.invalidate(isFavoriteProvider(widget.id)); // Providerを更新
      },
    );
  }

  Widget _buildFavoriteIcon(bool isFavorite) {
    return AnimatedScale(
      scale: isFavorite ? 1.1 : 1.0,
      duration: const Duration(milliseconds: 100),
      child: AnimatedOpacity(
        opacity: isFavorite ? 0.9 : 0.5,
        duration: const Duration(milliseconds: 100),
        child: Icon(
          Icons.favorite,
          color: isFavorite ? Colors.red : Colors.grey,
        ),
      ),
    );
  }
}
