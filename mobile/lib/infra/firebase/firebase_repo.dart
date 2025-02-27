import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_storage/firebase_storage.dart';
import 'package:flutter/foundation.dart';
import 'package:mobile/infra/firebase/converter_extensions.dart';
import 'package:mobile/models/creator.dart';
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

      final exhibitsSnap = await docSnap.reference
          .collection('exhibits')
          .withExhibitConverter(this)
          .get();
      final exhibits =
          exhibitsSnap.docs.map((docSnap) => docSnap.data()).toList();

      final productsSnap = await docSnap.reference
          .collection('products')
          .orderBy('order')
          .withProductConverter(this)
          .get();
      final products =
          productsSnap.docs.map((docSnap) => docSnap.data()).toList();

      final highlightProduct = await _getHighlightProduct(docSnap);

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

  Future<Product?> _getHighlightProduct(
    DocumentSnapshot<Map<String, dynamic>> docSnap,
  ) async {
    final productsCollectionRef = docSnap.reference.collection('products');
    final data = docSnap.data();

    final highlightProductId = toStr(data?['highlightProductId']);
    if (highlightProductId.isNotEmpty) {
      final highlightProductSnap = await productsCollectionRef
          .doc(highlightProductId)
          .withProductConverter(this)
          .get();
      return highlightProductSnap.data();
    }

    final firstProduct = await productsCollectionRef
        .orderBy('order')
        .limit(1)
        .withProductConverter(this)
        .get();

    if (firstProduct.docs.isEmpty) {
      return null;
    }

    return firstProduct.docs.first.data();
  }
}
