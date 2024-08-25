import 'package:flutter/material.dart';
import 'package:gap/gap.dart';
import 'package:mobile/models/book.dart';
import 'package:mobile/providers/data_provider.dart';
import 'package:mobile/providers/navigate_provider.dart';
import 'package:mobile/screens/book_detail_screen.dart';
import 'package:mobile/widgets/empty_state.dart';

class BookListScreen extends StatefulWidget {
  const BookListScreen({super.key});

  @override
  State<BookListScreen> createState() => _BookListScreenState();
}

class _BookListScreenState extends State<BookListScreen> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('書籍一覧'),
      ),
      body: GridView.count(
        padding: const EdgeInsets.all(16),
        crossAxisCount: 2,
        mainAxisSpacing: 8,
        crossAxisSpacing: 8,
        physics: const NeverScrollableScrollPhysics(), // GridViewのスクロールを無効化
        shrinkWrap: true, // GridViewの高さをコンテンツに合わせる
        children: _getResults(),
      ),
    );
  }

  List<Widget> _getResults() {
    final results = DataProvider()
        .books
        .map((book) => BookItem(book: book))
        .map<Widget>((item) => GestureDetector(
              onTap: () => NavigateProvider.push(
                  context, BookDetailScreen(book: item.book)),
              child: item,
            ))
        .toList();

    return results.isEmpty
        ? [
            const Gap(16),
            const EmptyState(message: '表示可能な書籍が見つかりませんでした。'),
          ]
        : results;
  }
}

class BookItem extends StatelessWidget {
  const BookItem({
    super.key,
    required this.book,
  });

  final Book book;

  @override
  Widget build(BuildContext context) {
    return Image.network(book.image);
  }
}
