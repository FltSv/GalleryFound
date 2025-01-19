import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_storage/firebase_storage.dart';
import 'package:flutter/foundation.dart';
import 'package:mobile/models/creator.dart';
import 'package:mobile/models/exhibit.dart';
import 'package:mobile/models/gallery.dart';
import 'package:mobile/models/product.dart';
import 'package:mobile/providers/config_provider.dart';
import 'package:mobile/repos/data_repo_base.dart';

class FirebaseRepo implements DataRepoBase {
  @override
  Future<List<Creator>> fetchCreators() async {
    final db = FirebaseFirestore.instance;
    final querySnap = await db.collection('creators').get();

    final ignoreIds = ConfigProvider().config.debugUserIds;

    final fetchTasks = querySnap.docs
        .where((docSnap) => kDebugMode || !ignoreIds.contains(docSnap.id))
        .map((docSnap) async {
      final data = docSnap.data();

      final profileHashtags =
          ((data['profileHashtags'] ?? <String>[]) as List<dynamic>)
              .cast<String>();

      final exhibitsMaps = (docSnap.get('exhibits') as List<dynamic>)
          .cast<Map<String, dynamic>>();
      final exhibitTasks = exhibitsMaps.map(
        (exhibit) async => Exhibit(
          id: toStr(exhibit['id']),
          title: toStr(exhibit['title']),
          location: toStr(exhibit['location']),
          galleryId: toStr(exhibit['galleryId']),
          image: toStr(exhibit['image']),
          fetchThumbUrl: getThumbUrl,
          startDate: toDateTime(exhibit['startDate']),
          endDate: toDateTime(exhibit['endDate']),
        ),
      );
      final exhibits = await Future.wait(exhibitTasks);

      final productMaps = (docSnap.get('products') as List<dynamic>)
          .cast<Map<String, dynamic>>();
      final productsTasks = productMaps.map(
        (product) async => Product(
          id: toStr(product['id']),
          title: toStr(product['title']),
          detail: toStr(product['detail']),
          image: toStr(product['image']),
          fetchThumbUrl: getThumbUrl,
        ),
      );
      final products = await Future.wait(productsTasks);

      final highlightProduct = products.isNotEmpty
          ? products.firstWhere(
              (product) => product.id == data['highlightProductId'],
              orElse: () => products.first,
            )
          : null;

      return Creator(
        id: docSnap.id,
        name: toStr(data['name']),
        genre: toStr(data['genre']),
        profile: toStr(data['profile']),
        profileHashtags: profileHashtags,
        links: ((data['links'] ?? <String>[]) as List<dynamic>).cast<String>(),
        highlightProduct: highlightProduct,
        products: products,
        exhibits: exhibits,
      );
    });

    return Future.wait(fetchTasks);
  }

  @override
  Future<List<Gallery>> fetchGalleries() async {
    final db = FirebaseFirestore.instance;
    final querySnap = await db.collection('galleries').get();

    return querySnap.docs.map((docSnap) {
      final data = docSnap.data();

      return Gallery(
        id: docSnap.id,
        name: toStr(data['name']),
        location: toStr(data['location']),
      );
    }).toList();
  }

  @override
  String getImageUrl(String userId, String image) {
    const domain =
        'firebasestorage.googleapis.com/v0/b/gallery-found.appspot.com';
    return 'https://$domain/o/creators%2F$userId%2F$image';
  }

  @override
  Future<String?> getThumbUrl(String userId, String image) async {
    final thumbImage = image.replaceAll(RegExp(r'\.png\?.*'), '.webp');
    final path = 'creators/$userId/thumbs/$thumbImage';

    try {
      final ref = FirebaseStorage.instance.ref().child(path);
      final url = await ref.getDownloadURL(); // ダウンロードURLを取得
      return url;
    } on Object {
      return null;
    }
  }

  DateTime toDateTime(dynamic value, {DateTime? defaultValue}) {
    if (value is! Timestamp) {
      return defaultValue ?? DateTime(1970);
    }

    return value.toDate();
  }

  String toStr(dynamic value) {
    if (value == null) {
      return '';
    }

    return value.toString();
  }
}
