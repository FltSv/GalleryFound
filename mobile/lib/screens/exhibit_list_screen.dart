import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:gap/gap.dart';
import 'package:intersperse/intersperse.dart';
import 'package:mobile/providers/data_provider.dart';
import 'package:mobile/providers/navigate_provider.dart';
import 'package:mobile/screens/exhibit_detail_screen.dart';
import 'package:mobile/widgets/empty_state.dart';
import 'package:mobile/widgets/exhibit_item.dart';

class ExhibitListScreen extends ConsumerStatefulWidget {
  const ExhibitListScreen({super.key});

  @override
  ConsumerState createState() => _ExhibitListScreenState();
}

class _ExhibitListScreenState extends ConsumerState<ExhibitListScreen> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('展示一覧'),
      ),
      body: FutureBuilder(
        future: _getResults(),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }

          final exhibits = snapshot.data;
          if (exhibits == null || exhibits.isEmpty) {
            return const EmptyState();
          }

          return ListView(
            padding: const EdgeInsets.all(16),
            children: exhibits,
          );
        },
      ),
    );
  }

  Future<List<Widget>> _getResults() async {
    final usecase = ref.watch(exhibitUsecaseProvider);
    final items = await usecase.fetchExhibits(DateTime.now());

    final results = items
        .map((item) {
          final exhibit = item.$1;
          final gallery = item.$2;
          final galleryAddress = gallery.location;

          return ExhibitItem(
            exhibit: exhibit,
            galleryAddress: galleryAddress,
          );
        })
        .map<Widget>(
          (item) => GestureDetector(
            onTap: () => NavigateProvider.push(
              context,
              ExhibitDetailScreen(exhibit: item.exhibit),
            ),
            child: item,
          ),
        )
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
