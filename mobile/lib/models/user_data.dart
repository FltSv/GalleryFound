import 'package:mobile/models/favorite_id.dart';

class UserData {
  UserData({required this.favorites});

  factory UserData.fromJson(Map<String, dynamic> json) {
    return UserData(
      favorites: (json['favorites'] as List<dynamic>)
          .map((item) => FavoriteId.fromJson(item as Map<String, dynamic>))
          .toList(),
    );
  }

  final List<FavoriteId> favorites;

  Map<String, dynamic> toJson() => {
        'favorites': favorites.map((f) => f.toJson()).toList(),
      };
}
