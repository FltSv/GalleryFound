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
    final querySnap = await db.collection("creators").get();

    final ignoreIds = ConfigProvider().config.debugUserIds;

    final fetchTasks = querySnap.docs
        .where((docSnap) => kDebugMode || !ignoreIds.contains(docSnap.id))
        .map((docSnap) async {
      final data = docSnap.data();

      final exhibitsMaps = (docSnap.get("exhibits") as List<dynamic>)
          .cast<Map<String, dynamic>>();
      final exhibitTasks = exhibitsMaps.map((exhibit) async => Exhibit(
            id: exhibit["id"],
            title: exhibit["title"],
            location: exhibit["location"],
            galleryId: exhibit["galleryId"],
            image: exhibit["image"],
            thumbUrl: await getThumbUrl(docSnap.id, exhibit["image"]),
            startDate: exhibit["startDate"].toDate(),
            endDate: exhibit["endDate"].toDate(),
          ));
      final exhibits = await Future.wait(exhibitTasks);

      final productMaps = (docSnap.get("products") as List<dynamic>)
          .cast<Map<String, dynamic>>();
      final productsTasks = productMaps.map((product) async => Product(
            id: product["id"],
            title: product["title"] ?? "",
            detail: product["detail"] ?? "",
            image: product["image"],
            thumbUrl: await getThumbUrl(docSnap.id, product["image"]),
          ));
      final products = await Future.wait(productsTasks);

      final highlightProduct = products.isNotEmpty
          ? products.firstWhere(
              (product) => product.id == data["highlightProductId"],
              orElse: () => products.first,
            )
          : null;

      return Creator(
        id: docSnap.id,
        name: data["name"],
        genre: data["genre"],
        profile: data["profile"] ?? "",
        links: ((data["links"] ?? []) as List<dynamic>).cast<String>(),
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
    final querySnap = await db.collection("galleries").get();

    return querySnap.docs.map((docSnap) {
      final data = docSnap.data();

      return Gallery(
        id: docSnap.id,
        name: data["name"],
        location: data["location"],
      );
    }).toList();
  }

  @override
  String getImageUrl(String userId, String image) {
    const domain =
        "firebasestorage.googleapis.com/v0/b/gallery-found.appspot.com";
    return "https://$domain/o/creators%2F$userId%2F$image";
  }

  Future<String?> getThumbUrl(String userId, String image) async {
    final thumbImage = image.replaceAll(RegExp(r'\.png\?.*'), '.webp');
    final path = 'creators/$userId/thumbs/$thumbImage';

    try {
      final ref = FirebaseStorage.instance.ref().child(path);
      final url = await ref.getDownloadURL(); // ダウンロードURLを取得
      return url;
    } catch (e) {
      return null;
    }
  }
}
