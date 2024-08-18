import 'package:flutter/material.dart';
import 'package:gap/gap.dart';
import 'package:mobile/models/book.dart';
import 'package:mobile/providers/navigate_provider.dart';
import 'package:mobile/screens/book_detail_screen.dart';
import 'package:mobile/widgets/empty_state.dart';

class BookListScreen extends StatefulWidget {
  const BookListScreen({super.key});

  @override
  State<BookListScreen> createState() => _BookListScreenState();
}

class _BookListScreenState extends State<BookListScreen> {
  final List<Book> books = [
    Book(
        id: '1',
        title: 'ひまわり',
        image:
            'https://media.mstdn.jp/accounts/avatars/110/989/102/133/377/139/original/ef63d785a819a2f2.png',
        urls: ['https://mstdn.jp/@himarori']),
    Book(
        id: '2',
        title: '砂ちゃん',
        image:
            'https://media.mstdn.jp/accounts/avatars/000/113/775/original/4a94c289c389d678.jpg',
        urls: ['https://mstdn.jp/@fltsv', 'https://mstdn.jp/@himarori']),
    Book(
        id: '3',
        title: 'よるねこ',
        image:
            'https://media.mstdn.jp/accounts/avatars/000/155/200/original/2e948193ee954e55428290ad6ecada7f.png',
        urls: [
          'https://mstdn.jp/@NightCat',
          'https://mstdn.jp/@himarori',
          'https://mstdn.jp/@fltsv'
        ]),
    Book(
        id: '4',
        title: 'もやちゃ',
        image:
            'https://media.mstdn.jp/accounts/avatars/109/719/600/512/825/943/original/898331de566f6f5e.png',
        urls: [
          'https://mstdn.jp/@kisskamakiri',
          'https://mstdn.jp/@fltsv',
          'https://mstdn.jp/@NightCat',
          'https://mstdn.jp/@himarori'
        ])
  ];

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
    final results = books
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
