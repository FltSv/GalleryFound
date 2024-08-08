import 'package:flutter/material.dart';
import 'package:gap/gap.dart';
import 'package:intersperse/intersperse.dart';
import 'package:mobile/models/creator.dart';
import 'package:mobile/providers/data_provider.dart';
import 'package:mobile/providers/navigate_provider.dart';
import 'package:mobile/screens/exhibit_detail_screen.dart';
import 'package:mobile/widgets/empty_state.dart';
import 'package:mobile/widgets/exhibit_item.dart';

class ExhibitListScreen extends StatefulWidget {
  const ExhibitListScreen({super.key});

  @override
  State<ExhibitListScreen> createState() => _ExhibitListScreenState();
}

class _ExhibitListScreenState extends State<ExhibitListScreen> {
  final List<Creator> creators = DataProvider().creators;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('展示一覧'),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: _getResults(),
      ),
    );
  }

  List<Widget> _getResults() {
    final results = creators
        .map((creator) =>
            creator.exhibits.map((exhibit) => ExhibitItem(exhibit: exhibit)))
        .expand((element) => element)
        .where((item) => item.exhibit.isWithin(DateTime.now()))
        .map<Widget>((item) => GestureDetector(
              onTap: () => NavigateProvider.push(
                  context, ExhibitDetailScreen(exhibit: item.exhibit)),
              child: item,
            ))
        .intersperse(const Gap(8))
        .toList();

    return results.isEmpty
        ? [
            const Gap(16),
            const EmptyState(message: '現在公開中の展示は見つかりませんでした。'),
          ]
        : results;
  }
}
