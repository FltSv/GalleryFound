import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_storage/firebase_storage.dart';
import 'package:flutter/foundation.dart';
import 'package:mobile/infra/firebase/converter_extensions.dart';
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

      final highlightProduct = await _getHighlightProduct(docSnap);

      return Creator(
        id: docSnap.id,
        name: toStr(data['name']),
        genre: toStr(data['genre']),
        profile: toStr(data['profile']),
        profileHashtags: profileHashtags,
        links: ((data['links'] ?? <String>[]) as List<dynamic>).cast<String>(),
        highlightProduct: highlightProduct,
      );
    });

    return Future.wait(fetchTasks);
  }

  @override
  Future<List<Gallery>> fetchGalleries() async {
    final db = FirebaseFirestore.instance;
    final querySnap =
        await db.collection('galleries').withGalleryConverter(this).get();

    return querySnap.docs.map((docSnap) => docSnap.data()).toList();
  }

  @override
  Future<Gallery> fetchGalleryById(String galleryId) async {
    final db = FirebaseFirestore.instance;
    final docSnap = await db
        .collection('galleries')
        .doc(galleryId)
        .withGalleryConverter(this)
        .get();

    if (!docSnap.exists) {
      throw Exception('GalleryId"$galleryId" is not found.');
    }

    return docSnap.data()!;
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

  @override
  Future<List<Product>> fetchCreatorProducts(Creator creator) async {
    final db = FirebaseFirestore.instance;

    final productsSnap = await db
        .collection('creators')
        .doc(creator.id)
        .collection('products')
        .orderBy('order')
        .withProductConverter(this)
        .get();

    return productsSnap.docs
        .map((docSnap) => docSnap.data()..creator = creator)
        .toList();
  }

  @override
  Future<List<Exhibit>> fetchCreatorExhibits(Creator creator) async {
    final db = FirebaseFirestore.instance;

    final exhibitsSnap = await db
        .collection('creators')
        .doc(creator.id)
        .collection('exhibits')
        .withExhibitConverter(this)
        .get();

    return exhibitsSnap.docs
        .map((docSnap) => docSnap.data()..creator = creator)
        .toList();
  }

  @override
  Future<List<Exhibit>> fetchExhibitsAfterDate(
    DateTime date,
    List<Creator> creators,
  ) async {
    final db = FirebaseFirestore.instance;
    final exhibitsSnap = await db
        .collectionGroup('exhibits')
        .where('endDate', isGreaterThanOrEqualTo: date)
        .withExhibitConverter(this)
        .get();

    return exhibitsSnap.docs.map((docSnap) {
      final creatorId = docSnap.reference.parent.parent!.id;
      final creator = creators.firstWhere((creator) => creator.id == creatorId);

      return docSnap.data()..creator = creator;
    }).toList();
  }

  @override
  Future<List<Product>> fetchProducts({
    required List<Creator> creators,
    required int limit,
    Product? lastProduct,
  }) async {
    final db = FirebaseFirestore.instance;
    final productsQuery = db
        .collectionGroup('products')
        .orderBy('id', descending: true)
        .withProductConverter(this);

    if (lastProduct != null) {
      final lastDocQuerySnap = await productsQuery
          .where('id', isEqualTo: lastProduct.id)
          .limit(1)
          .get();

      final lastDocSnap = lastDocQuerySnap.docs.first;

      if (lastDocSnap.exists) {
        final querySnap = await productsQuery
            .startAfterDocument(lastDocSnap)
            .limit(limit)
            .get();

        return querySnap.docs.map((docSnap) {
          final creatorId = docSnap.reference.parent.parent!.id;
          final creator =
              creators.firstWhere((creator) => creator.id == creatorId);

          return docSnap.data()..creator = creator;
        }).toList();
      }
    }

    final querySnap = await productsQuery.limit(limit).get();
    return querySnap.docs.map((docSnap) {
      final creatorId = docSnap.reference.parent.parent!.id;
      final creator = creators.firstWhere((creator) => creator.id == creatorId);

      return docSnap.data()..creator = creator;
    }).toList();
  }
}
