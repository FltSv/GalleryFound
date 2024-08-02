import 'package:flutter/material.dart';
import 'package:gap/gap.dart';
import 'package:intersperse/intersperse.dart';
import 'package:mobile/models/creator.dart';
import 'package:mobile/models/exhibit.dart';
import 'package:mobile/providers/data_provider.dart';
import 'package:mobile/widgets/link_text.dart';

class ExhibitDetailScreen extends StatefulWidget {
  const ExhibitDetailScreen({
    super.key,
    required this.exhibit,
    required this.creator,
  });

  final Exhibit exhibit;
  final Creator creator;

  @override
  State<ExhibitDetailScreen> createState() => _ExhibitDetailScreenState();
}

class _ExhibitDetailScreenState extends State<ExhibitDetailScreen> {
  @override
  Widget build(BuildContext context) {
    final exhibit = widget.exhibit;
    final creator = widget.creator;

    return Scaffold(
      appBar: AppBar(
        title: Text(exhibit.title),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Image.network(DataProvider().getImageUrl(creator.id, exhibit.image)),
          const Gap(8),
          Text(exhibit.displayDate),
          LinkText(text: exhibit.location, onTap: () {}),
          LinkText(text: creator.name, onTap: () {}),
        ].intersperse(const Gap(8)).toList(),
      ),
    );
  }
}
