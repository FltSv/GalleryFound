import 'package:flutter/material.dart';
import 'package:gap/gap.dart';
import 'package:intersperse/intersperse.dart';
import 'package:mobile/models/creator.dart';
import 'package:mobile/models/exhibit.dart';
import 'package:mobile/providers/data_provider.dart';

class ExhibitItem extends StatelessWidget {
  const ExhibitItem({
    super.key,
    required this.exhibit,
    required this.creator,
  });

  final Exhibit exhibit;
  final Creator creator;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Expanded(
          flex: 3,
          child: Image.network(
              DataProvider().getImageUrl(creator.id, exhibit.image)),
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
