import 'package:flutter/material.dart';
import 'package:gap/gap.dart';
import 'package:intersperse/intersperse.dart';
import 'package:mobile/models/book.dart';
import 'package:mobile/widgets/link_text.dart';
import 'package:url_launcher/url_launcher.dart';

class BookDetailScreen extends StatefulWidget {
  const BookDetailScreen({
    super.key,
    required this.book,
  });

  final Book book;

  @override
  State<BookDetailScreen> createState() => _BookDetailScreenState();
}

class _BookDetailScreenState extends State<BookDetailScreen> {
  @override
  Widget build(BuildContext context) {
    final book = widget.book;

    return Scaffold(
      appBar: AppBar(
        title: Text(book.title),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Image.network(book.image),
          const Gap(8),
          ...book.urls.map(
            (urltext) => LinkText(
              text: urltext,
              onTap: () async {
                final url = Uri.parse(urltext);
                await launchUrl(url, mode: LaunchMode.externalApplication);
              },
            ),
          ),
        ].intersperse(const Gap(8)).toList(),
      ),
    );
  }
}
