import 'package:flutter/material.dart';
import 'package:gap/gap.dart';
import 'package:intersperse/intersperse.dart';
import 'package:mobile/models/exhibit.dart';
import 'package:mobile/widgets/thumb_image.dart';

class ExhibitItem extends StatelessWidget {
  const ExhibitItem({
    super.key,
    required this.exhibit,
    this.galleryAddress,
  });

  final Exhibit exhibit;
  final String? galleryAddress;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Expanded(
          flex: 3,
          child: ThumbImage(imageBase: exhibit),
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
                if (galleryAddress != null)
                  Text(
                    galleryAddress!,
                    style: theme.textTheme.bodySmall,
                  ),
                Text(
                  exhibit.displayDate,
                  style: theme.textTheme.bodySmall,
                ),
              ].intersperse(const Gap(4)).toList(),
            ),
          ),
        ),
      ],
    );
  }
}
