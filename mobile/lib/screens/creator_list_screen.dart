import 'package:flutter/material.dart';
import 'package:mobile/models/creator.dart';
import 'package:mobile/providers/data_provider.dart';
import 'package:mobile/screens/creator_detail_screen.dart';

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
              decoration: const InputDecoration(hintText: '検索'),
              onChanged: (String value) {
                setState(() => searchText = value);
              },
            ),
          ),
          Expanded(
            child: ListView(
              children: results
                  .map(
                    (creator) => Padding(
                      padding: const EdgeInsets.symmetric(
                        vertical: 12,
                        horizontal: 16,
                      ),
                      child: GestureDetector(
                        onTap: () {
                          Navigator.of(context).push(MaterialPageRoute(
                            builder: ((context) =>
                                CreatorDetailScreen(creator: creator)),
                          ));
                        },
                        child: Text(creator.name),
                      ),
                    ),
                  )
                  .toList(),
            ),
          ),
        ],
      ),
    );
  }
}
