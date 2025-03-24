import 'package:mobile/models/favorite_id.dart';

class UserData {
  UserData({required this.favorites, required this.isDevelopDB});

  factory UserData.fromJson(Map<String, dynamic> json) {
    return UserData(
      favorites: (json['favorites'] as List<dynamic>? ?? [])
          .map((item) => FavoriteId.fromJson(item as Map<String, dynamic>))
          .toList(),
      isDevelopDB: json['isDevelopDB'] as bool? ?? false,
    );
  }

  final List<FavoriteId> favorites;
  final bool isDevelopDB;

  Map<String, dynamic> toJson() => {
        'favorites': favorites.map((f) => f.toJson()).toList(),
        'isDevelopDB': isDevelopDB,
      };
}
