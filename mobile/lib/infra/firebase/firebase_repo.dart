import 'package:cloud_firestore/cloud_firestore.dart';
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

    return querySnap.docs
        .where((docSnap) => kDebugMode || !ignoreIds.contains(docSnap.id))
        .map((docSnap) {
      final data = docSnap.data();

      final exhibits = (docSnap.get("exhibits") as List<dynamic>)
          .cast<Map<String, dynamic>>();

      final productMaps = (docSnap.get("products") as List<dynamic>)
          .cast<Map<String, dynamic>>();
      final products = productMaps
          .map((product) => Product(
                id: product["id"],
                title: product["title"] ?? "",
                detail: product["detail"] ?? "",
                image: product["image"],
              ))
          .toList();

      final highlightProduct = products.isNotEmpty
          ? products.firstWhere(
              (product) => product.id == data["highlightProductId"],
              orElse: () => products.first,
            )
          : null;

      return Creator(
        id: docSnap.id,
        name: data["name"],
        profile: data["profile"] ?? "",
        links: ((data["links"] ?? []) as List<dynamic>).cast<String>(),
        highlightProduct: highlightProduct,
        products: products,
        exhibits: exhibits
            .map((exhibit) => Exhibit(
                  id: exhibit["id"],
                  title: exhibit["title"],
                  location: exhibit["location"],
                  galleryId: exhibit["galleryId"],
                  image: exhibit["image"],
                  startDate: exhibit["startDate"].toDate(),
                  endDate: exhibit["endDate"].toDate(),
                ))
            .toList(),
      );
    }).toList();
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
}
