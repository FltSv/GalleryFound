import 'package:flutter/material.dart';
import 'package:mobile/models/creator.dart';
import 'package:mobile/providers/data_provider.dart';
import 'package:mobile/screens/creator_detail_screen.dart';
import 'package:mobile/widgets/creator_item.dart';
import 'package:mobile/widgets/empty_state.dart';
import 'package:mobile/widgets/highlighted_text.dart';

class WordSearchScreen extends StatelessWidget {
  final String query;
  final Iterable<Creator> Function(List<Creator> creators, String query)
      searchFilter; // 検索ロジック

  const WordSearchScreen({
    super.key,
    required this.query,
    required this.searchFilter,
  });

  @override
  Widget build(BuildContext context) {
    final creators = DataProvider().creators;

    // 外部から渡された検索ロジックを適用
    final filteredCreators = searchFilter(creators, query).toList();

    return Scaffold(
      appBar: AppBar(
        title: Text(query),
      ),
      body: Padding(
        padding: const EdgeInsets.all(8),
        child: filteredCreators.isEmpty
            ? Center(
                child: EmptyState(
                  message: "該当するユーザーがいません",
                ),
              )
            : ListView.builder(
                itemCount: filteredCreators.length,
                itemBuilder: (context, index) {
                  final creator = filteredCreators[index];
                  return GestureDetector(
                    child: Card(
                      child: Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Expanded(
                            flex: 1, // CreatorItemの比率
                            child: CreatorItem(creator: creator, onTap: () {}),
                          ),
                          Expanded(
                            flex: 2, // HighlightedTextの比率
                            child: Padding(
                              padding: const EdgeInsets.all(8),
                              child: HighlightedText(
                                text: creator.profile,
                                word: query,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                    onTap: () {
                      // クリエイターの詳細画面に遷移する処理を追加
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) =>
                              CreatorDetailScreen(creator: creator),
                        ),
                      );
                    },
                  );
                },
              ),
      ),
    );
  }
}
