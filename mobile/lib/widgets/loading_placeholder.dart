import 'package:flutter/material.dart';

class LoadingPlaceholder extends StatelessWidget {
  const LoadingPlaceholder({super.key});

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        final width = constraints.maxWidth.isFinite
            ? constraints.maxWidth
            : MediaQuery.of(context).size.width;
        final height = width / (4 / 3);

        return SizedBox(
          width: width,
          height: height,
          child: Container(
            color: Colors.grey[300]?.withValues(alpha: 0.5),
            padding: const EdgeInsets.all(16),
            child: const Center(child: CircularProgressIndicator()),
          ),
        );
      },
    );
  }
}
