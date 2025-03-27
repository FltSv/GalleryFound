import 'package:flutter/material.dart';
import 'package:gap/gap.dart';
import 'package:intersperse/intersperse.dart';
import 'package:mobile/models/exhibit.dart';
import 'package:mobile/providers/navigate_provider.dart';
import 'package:mobile/screens/map_screen.dart';
import 'package:mobile/widgets/action_text.dart';
import 'package:mobile/widgets/creator_link.dart';
import 'package:mobile/widgets/thumb_interlace_image.dart';

class ExhibitDetailScreen extends StatelessWidget {
  const ExhibitDetailScreen({
    super.key,
    required this.exhibit,
  });

  final Exhibit exhibit;

  @override
  Widget build(BuildContext context) {
    final creator = exhibit.creator;

    return Scaffold(
      appBar: AppBar(
        title: Text(exhibit.title),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              ThumbInterlaceImage(imageBase: exhibit),
              const Gap(8),
              Text(exhibit.displayDate),
              ActionText(
                text: exhibit.location,
                onTap: () => NavigateProvider.push(
                  context,
                  MapScreen(exhibit: exhibit),
                ),
              ),
              CreatorLink(creator: creator),
            ].intersperse(const Gap(8)).toList(),
          ),
        ],
      ),
    );
  }
}
