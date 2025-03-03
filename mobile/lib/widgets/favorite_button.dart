import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:mobile/application/usecases/product_usecase.dart';

class FavoriteButton extends StatefulWidget {
  const FavoriteButton({
    super.key,
    required this.id,
    required this.productUsecase,
  });

  final String id;
  final ProductUsecase productUsecase;

  @override
  State<FavoriteButton> createState() => _FavoriteButtonState();
}

class _FavoriteButtonState extends State<FavoriteButton> {
  @override
  Widget build(BuildContext context) {
    return IconButton(
      icon: FutureBuilder<bool>(
        future: widget.productUsecase.isFavorite(widget.id),
        builder: (context, snapshot) {
          final isFavorite = snapshot.data == true;

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
        },
      ),
      onPressed: () async {
        await HapticFeedback.lightImpact();
        await widget.productUsecase.toggleFavorite(widget.id);
        setState(() {});
      },
    );
  }
}
