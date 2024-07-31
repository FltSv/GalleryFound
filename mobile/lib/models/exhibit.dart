import 'package:intl/intl.dart';

/// 展示
class Exhibit {
  Exhibit({
    required this.id,
    required this.title,
    required this.location,
    required this.galleryId,
    required this.image,
    required this.startDate,
    required this.endDate,
  });

  final String id;

  /// 展示名
  final String title;

  /// 展示場所（ギャラリー）
  final String location;
  final String galleryId;

  /// イメージ画像のファイル名＋トークン
  final String image;

  /// 展示開始日
  final DateTime startDate;

  /// 展示終了日
  final DateTime endDate;

  /// 展示日の表示
  static final DateFormat _dateFormat = DateFormat('yyyy/MM/dd');
  String get displayDate =>
      "${_dateFormat.format(startDate)} ～ ${_dateFormat.format(endDate)}";
}
