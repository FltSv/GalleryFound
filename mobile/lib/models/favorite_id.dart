class FavoriteId {
  FavoriteId({required this.id});

  factory FavoriteId.fromJson(Map<String, dynamic> json) {
    return FavoriteId(id: json['id'].toString());
  }

  final String id;

  Map<String, dynamic> toJson() => {'id': id};
}
