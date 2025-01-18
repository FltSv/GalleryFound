import 'package:flutter/material.dart';
import 'package:flutter_staggered_grid_view/flutter_staggered_grid_view.dart';
import 'package:gap/gap.dart';
import 'package:mobile/models/creator.dart';
import 'package:mobile/providers/config_provider.dart';
import 'package:mobile/providers/data_provider.dart';
import 'package:mobile/providers/navigate_provider.dart';
import 'package:mobile/screens/creator_detail_screen.dart';
import 'package:mobile/screens/word_search_screen.dart';
import 'package:mobile/widgets/creator_item.dart';

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
  bool tagSearch = false;
  int _autoCompleteKey = 0;

  /// [selectedGenre]に一致する[Creator]を取得
  Iterable<Creator> get genreFilteredCreators {
    if (selectedGenre == null) {
      return creators;
    }

    return creators.where((creator) => creator.genre == selectedGenre);
  }

  /// [selectedGenre]と[searchText]に一致する[Creator]を取得
  List<Creator> get results {
    if (tagSearch || searchText.isEmpty) {
      return genreFilteredCreators.toList();
    }

    return genreFilteredCreators.where((creator) {
      final matchesSearch = creator.name.contains(searchText);
      return matchesSearch;
    }).toList();
  }

  /// [genreFilteredCreators]リスト内のプロフィールに含まれる一意なハッシュタグの出現回数をマッピング
  Map<String, int> get hashtagCounts {
    final map = Map<String, int>.unmodifiable(
      genreFilteredCreators
          .expand((creator) => creator.profileHashtags)
          .fold<Map<String, int>>(
        <String, int>{},
        (counts, hashtag) => {
          ...counts,
          hashtag: (counts[hashtag] ?? 0) + 1,
        },
      ),
    );

    final sortedEntries = map.entries.toList()
      ..sort((a, b) => b.value.compareTo(a.value));

    return Map.fromEntries(sortedEntries);
  }

  /// AutoCompleteの再描画
  void _rebuildAutoComplete() {
    setState(() {
      _autoCompleteKey ^= DateTime.now().hashCode;
    });
  }

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
                spacing: 8,
                children: genres
                    .map(
                      (genre) => ChoiceChip(
                        label: Text(genre),
                        selected: genre == selectedGenre,
                        onSelected: (selected) {
                          setState(() {
                            selectedGenre = selected ? genre : null;
                          });

                          _rebuildAutoComplete();
                        },
                      ),
                    )
                    .toList(),
              ),
            ),
          ),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 8),
            child: Row(
              children: [
                IconButton(
                  icon: const Icon(Icons.tag),
                  color: tagSearch ? null : Colors.grey,
                  onPressed: () {
                    setState(() => tagSearch = !tagSearch);
                  },
                  isSelected: tagSearch,
                ),
                if (!tagSearch)
                  Expanded(
                    child: TextField(
                      decoration: const InputDecoration(hintText: '作家を検索'),
                      onChanged: (String value) {
                        setState(() => searchText = value);
                      },
                    ),
                  ),
                if (tagSearch)
                  Expanded(
                    child: Autocomplete<String>(
                      key: ValueKey(_autoCompleteKey),
                      fieldViewBuilder:
                          (context, controller, focusNode, onFieldSubmitted) {
                        return TextField(
                          controller: controller,
                          focusNode: focusNode,
                          decoration:
                              const InputDecoration(hintText: 'ハッシュタグで検索'),
                        );
                      },
                      optionsBuilder: (TextEditingValue textEditingValue) {
                        const maxTagCount = 10;
                        final text = textEditingValue.text;

                        // 入力文字が空のときのみ、使用頻度の高いハッシュタグを表示
                        if (text.isEmpty) {
                          return hashtagCounts.keys.take(maxTagCount);
                        }

                        // それ以外は通常のサジェスト
                        return hashtagCounts.keys
                            .where(
                              (word) => word
                                  .toLowerCase()
                                  .contains(text.toLowerCase()),
                            )
                            .take(maxTagCount);
                      },
                      onSelected: (hashtag) {
                        _rebuildAutoComplete();

                        NavigateProvider.push(
                          context,
                          WordSearchScreen(
                            query: hashtag,
                            searchFilter: (creators, query) =>
                                creators.where((creator) {
                              if (selectedGenre == null) {
                                return true;
                              }
                              return creator.genre == selectedGenre;
                            }).where(
                              (creator) =>
                                  creator.profileHashtags.contains(hashtag),
                            ),
                          ),
                        );
                      },
                    ),
                  ),
              ],
            ),
          ),
          const Gap(8),
          Expanded(
            child: MasonryGridView.builder(
              gridDelegate:
                  const SliverSimpleGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 2, // 横に並べる数を調整します
              ),
              itemCount: results.length,
              itemBuilder: (context, index) {
                final creator = results[index];

                return CreatorItem(
                  creator: creator,
                  onTap: () {
                    Navigator.of(context).push(
                      MaterialPageRoute<void>(
                        builder: (context) =>
                            CreatorDetailScreen(creator: creator),
                      ),
                    );
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
