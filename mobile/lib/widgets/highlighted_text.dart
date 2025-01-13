import 'package:flutter/material.dart';

class HighlightedText extends StatelessWidget {
  final String text;
  final String word;

  const HighlightedText({
    super.key,
    required this.text,
    required this.word,
  });

  @override
  Widget build(BuildContext context) {
    // word引数に一致する部分をハイライトするスタイル
    final wordStyle = const TextStyle(
      fontWeight: FontWeight.bold,
    );

    // TextSpanのリストを格納する
    final List<InlineSpan> children = [];

    // splitMapJoin でハイライト部分と通常テキストを分割
    text.splitMapJoin(
      word,
      onMatch: (Match match) {
        final String matchedText = match[0]!; // "#..." の文字列

        // ハイライト部分：スタイルを適用する
        children.add(
          TextSpan(
            text: matchedText,
            style: wordStyle,
          ),
        );
        // splitMapJoin用に戻り値を返すが、子要素には追加済みなので空文字列でOK
        return '';
      },
      onNonMatch: (String nonMatch) {
        // 通常テキスト部分
        children.add(
          TextSpan(
            text: nonMatch,
            style: DefaultTextStyle.of(context).style,
          ),
        );
        return '';
      },
    );

    return RichText(
      text: TextSpan(
        // デフォルトのテキストスタイル（サイズや色）を適用させつつ、追加したTextSpanを表示
        style: DefaultTextStyle.of(context).style,
        children: children,
      ),
    );
  }
}
