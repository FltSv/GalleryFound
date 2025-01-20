class TextParser {
  static final RegExp _hashtagRegExp = RegExp(r'([#\s\u3000]#[^\s\u3000#]+)');

  List<TextSpanType> parse(String text) {
    final result = <TextSpanType>[];

    text.splitMapJoin(
      _hashtagRegExp,
      onMatch: (Match match) {
        final matchedText = match[0]!;
        result.add(Hashtag(matchedText));
        return '';
      },
      onNonMatch: (String nonMatch) {
        result.add(PlainText(nonMatch));
        return '';
      },
    );

    return result;
  }
}

class Hashtag extends TextSpanType {
  Hashtag(String value) : _value = value;

  final String _value;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is Hashtag &&
          runtimeType == other.runtimeType &&
          _value == other._value;

  @override
  int get hashCode => _value.hashCode;

  @override
  String toString() => _value;

  String trim() => _value.replaceAll(RegExp(r'[\s\u3000]'), '');
}

class PlainText extends TextSpanType {
  PlainText(this.value);
  final String value;
}

sealed class TextSpanType {}
