import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:gap/gap.dart';
import 'package:intersperse/intersperse.dart';
import 'package:mobile/application/usecases/creator_usecase.dart';
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
  final creators = DataProvider().creators;
  final galleries = DataProvider().galleries;

  @override
  Widget build(BuildContext context) {
    final usecase = ref.watch(creatorUsecaseProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('展示一覧'),
      ),
      body: FutureBuilder(
        future: _getResults(usecase),
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

  Future<List<Widget>> _getResults(CreatorUsecase usecase) async {
    final fetchExhibitsTasks =
        creators.map((creator) => usecase.fetchCreatorExhibits(creator));
    final creatorsExhibits = await Future.wait(fetchExhibitsTasks);

    final results = creatorsExhibits
        .expand((element) => element)
        .where((exhibit) => exhibit.endDate.isAfter(DateTime.now()))
        .map((exhibit) {
          final gallery = galleries
              .firstWhere((gallery) => gallery.id == exhibit.galleryId);
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
