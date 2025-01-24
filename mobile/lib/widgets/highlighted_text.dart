import 'package:flutter/material.dart';

class HighlightedText extends StatelessWidget {
  const HighlightedText({
    super.key,
    required this.text,
    required this.word,
  });

  final String text;
  final String word;

  @override
  Widget build(BuildContext context) {
    // word引数に一致する部分をハイライトするスタイル
    const wordStyle = TextStyle(
      fontWeight: FontWeight.bold,
    );

    // TextSpanのリストを格納する
    final children = <InlineSpan>[];

    // splitMapJoin でハイライト部分と通常テキストを分割
    text.splitMapJoin(
      word,
      onMatch: (Match match) {
        final matchedText = match[0]!; // "#..." の文字列

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
