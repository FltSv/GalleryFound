import 'package:intl/intl.dart';
import 'package:mobile/models/image_base.dart';

/// 展示
class Exhibit extends ImageBase {
  Exhibit({
    required this.id,
    required this.title,
    required this.location,
    required this.galleryId,
    required this.startDate,
    required this.endDate,
    required super.imagePath,
    required super.thumbPath,
    required super.creatorId,
  });

  final String id;

  /// 展示名
  final String title;

  /// 展示場所（ギャラリー）
  final String location;
  final String galleryId;

  /// 展示開始日
  final DateTime startDate;

  /// 展示終了日
  final DateTime endDate;

  /// 展示日の表示
  static final DateFormat _dateFormat = DateFormat('yyyy/MM/dd');
  String get displayDate =>
      '${_dateFormat.format(startDate)} ～ ${_dateFormat.format(endDate)}';

  /// 期間内であるか
  bool isWithin(DateTime dateTime) =>
      dateTime.isAfter(startDate) && dateTime.isBefore(endDate);
}
