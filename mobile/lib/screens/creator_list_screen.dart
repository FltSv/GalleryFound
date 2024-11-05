import 'package:flutter/material.dart';
import 'package:mobile/models/creator.dart';
import 'package:mobile/providers/data_provider.dart';
import 'package:mobile/screens/creator_detail_screen.dart';
import 'package:flutter_staggered_grid_view/flutter_staggered_grid_view.dart';

class CreatorListScreen extends StatefulWidget {
  const CreatorListScreen({super.key});

  @override
  State<CreatorListScreen> createState() => _CreatorListScreenState();
}

class _CreatorListScreenState extends State<CreatorListScreen> {
  final List<Creator> creators = DataProvider().creators;

  String searchText = '';
  List<Creator> get results {
    if (searchText.isEmpty) {
      return creators;
    }

    return creators
        .where((creator) => creator.name.contains(searchText))
        .toList();
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
            padding: const EdgeInsets.symmetric(
              vertical: 12,
              horizontal: 24,
            ),
            child: TextField(
              decoration: const InputDecoration(hintText: '作家を検索'),
              onChanged: (String value) {
                setState(() => searchText = value);
              },
            ),
          ),
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

class CreatorItem extends StatelessWidget {
  final Creator creator;
  final VoidCallback onTap;

  const CreatorItem({
    super.key,
    required this.creator,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final imageUrl = creator.highlightProduct?.imageUrl;

    return Card(
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(10.0),
      ),
      clipBehavior: Clip.antiAlias,
      child: GestureDetector(
        onTap: onTap,
        child: Stack(
          children: [
            // 背景画像またはプレースホルダー
            imageUrl != null
                ? Image.network(
                    imageUrl,
                    fit: BoxFit.cover,
                  )
                : Container(
                    color: Colors.grey[300], // プレースホルダーの背景色
                    child: Center(
                      child: Icon(
                        Icons.image_not_supported,
                        size: 50,
                        color: Colors.grey[500],
                      ),
                    ),
                  ),
            // シャドウグラデーション
            Positioned(
              bottom: 0,
              left: 0,
              right: 0,
              child: Container(
                height: 100,
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topCenter,
                    end: Alignment.bottomCenter,
                    colors: [
                      Colors.transparent,
                      Colors.black.withOpacity(0.8),
                    ],
                  ),
                ),
              ),
            ),
            // テキスト表示
            Positioned(
              bottom: 10.0,
              left: 10.0,
              child: Text(
                creator.name,
                style: Theme.of(context)
                    .textTheme
                    .titleMedium
                    ?.copyWith(color: Colors.white),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
