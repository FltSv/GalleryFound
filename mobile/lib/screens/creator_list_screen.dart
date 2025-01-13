import 'package:flutter/material.dart';
import 'package:gap/gap.dart';
import 'package:mobile/models/creator.dart';
import 'package:mobile/providers/config_provider.dart';
import 'package:mobile/providers/data_provider.dart';
import 'package:mobile/providers/navigate_provider.dart';
import 'package:mobile/screens/creator_detail_screen.dart';
import 'package:mobile/screens/word_search_screen.dart';
import 'package:mobile/widgets/creator_item.dart';
import 'package:flutter_staggered_grid_view/flutter_staggered_grid_view.dart';

class CreatorListScreen extends StatefulWidget {
  const CreatorListScreen({super.key});

  @override
  State<CreatorListScreen> createState() => _CreatorListScreenState();
}

class _CreatorListScreenState extends State<CreatorListScreen> {
  final List<Creator> creators = DataProvider().creators;
  final List<String> genres = ConfigProvider().config.genres;

  String searchText = '';
  String? selectedGenre;

  List<Creator> get results {
    if (selectedGenre == null && searchText.isEmpty) {
      return creators;
    }

    return creators.where((creator) {
      final matchesGenre =
          selectedGenre == null || creator.genre == selectedGenre;
      final matchesSearch =
          searchText.isEmpty || creator.name.contains(searchText);
      return matchesGenre && matchesSearch;
    }).toList();
  }

  /// [results]リスト内のプロフィールに含まれる一意なハッシュタグの出現回数をマッピング
  Map<String, int> get hashtagCounts => Map.unmodifiable(
        results.expand((creator) => creator.profileHashtags).fold(
          <String, int>{},
          (counts, hashtag) => {
            ...counts,
            hashtag: (counts[hashtag] ?? 0) + 1,
          },
        ),
      );

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('作家一覧'),
      ),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 8),
            child: Align(
              alignment: Alignment.centerLeft,
              child: Wrap(
                spacing: 8.0,
                children: genres
                    .map((genre) => ChoiceChip(
                          label: Text(genre),
                          selected: genre == selectedGenre,
                          onSelected: (selected) {
                            setState(() {
                              selectedGenre = selected ? genre : null;
                            });
                          },
                        ))
                    .toList(),
              ),
            ),
          ),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 8),
            child: Row(
              children: [
                PopupMenuButton<String>(
                  icon: Icon(Icons.tag),
                  onSelected: (hashtag) {
                    NavigateProvider.push(
                        context,
                        WordSearchScreen(
                          query: hashtag,
                          searchFilter: (creators, query) =>
                              // ハッシュタグが含まれるクリエイターをフィルタリング
                              creators.where((creator) =>
                                  creator.profileHashtags.contains(query)),
                        ));
                  },
                  itemBuilder: (_) => hashtagCounts.entries
                      .map((entry) => PopupMenuItem<String>(
                            value: entry.key,
                            child: Text('${entry.key} (${entry.value})'),
                          ))
                      .toList(),
                ),
                Expanded(
                  child: TextField(
                    decoration: const InputDecoration(hintText: '作家を検索'),
                    onChanged: (String value) {
                      setState(() => searchText = value);
                    },
                  ),
                ),
              ],
            ),
          ),
          Gap(8),
          Expanded(
            child: MasonryGridView.builder(
              gridDelegate: SliverSimpleGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 2, // 横に並べる数を調整します
              ),
              itemCount: results.length,
              itemBuilder: (context, index) {
                final creator = results[index];

                return CreatorItem(
                  creator: creator,
                  onTap: () {
                    Navigator.of(context).push(MaterialPageRoute(
                      builder: ((context) =>
                          CreatorDetailScreen(creator: creator)),
                    ));
                  },
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}
