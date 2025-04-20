import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/foundation.dart';
import 'package:mobile/infra/firebase/converter_extensions.dart';
import 'package:mobile/models/config.dart';
import 'package:mobile/models/creator.dart';
import 'package:mobile/models/exhibit.dart';
import 'package:mobile/models/gallery.dart';
import 'package:mobile/models/product.dart';
import 'package:mobile/repos/data_repo_base.dart';

class FirebaseRepo implements DataRepoBase {
  FirebaseRepo(Config config) : _config = config;

  final Config _config;

  @override
  Future<List<Creator>> fetchCreators() async {
    final db = FirebaseFirestore.instance;
    final orderConfig = _config.creatorsOrder;

    final querySnap = await db
        .collection('creators')
        .orderBy(orderConfig.field, descending: !orderConfig.isAsc)
        .withCreatorConverter(this)
        .get();

    final ignoreIds = _config.debugUserIds;

    return querySnap.docs
        .where((docSnap) => kDebugMode || !ignoreIds.contains(docSnap.id))
        .map((docSnap) => docSnap.data())
        .toList();
  }

  @override
  Future<Creator> fetchCreatorById(String creatorId) async {
    final db = FirebaseFirestore.instance;
    final docSnap = await db
        .collection('creators')
        .doc(creatorId)
        .withCreatorConverter(this)
        .get();

    if (!docSnap.exists) {
      throw Exception('CreatorId "$creatorId" is not found.');
    }

    return docSnap.data()!;
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
  String get storageImageBaseUrl =>
      'https://firebasestorage.googleapis.com/v0/b/gallery-found.appspot.com/o/creators%2F';

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

    return productsSnap.docs.map((docSnap) => docSnap.data()).toList();
  }

  @override
  Future<List<Exhibit>> fetchCreatorExhibits(Creator creator) async {
    final db = FirebaseFirestore.instance;
    final orderConfig = _config.exhibitsOrder;

    final exhibitsSnap = await db
        .collection('creators')
        .doc(creator.id)
        .collection('exhibits')
        .orderBy(orderConfig.field, descending: !orderConfig.isAsc)
        .withExhibitConverter(this)
        .get();

    return exhibitsSnap.docs.map((docSnap) => docSnap.data()).toList();
  }

  @override
  Future<List<Exhibit>> fetchExhibitsAfterDate(
    DateTime date,
  ) async {
    final db = FirebaseFirestore.instance;
    final ignoreCreatorIds = _config.debugUserIds;
    final orderConfig = _config.exhibitsOrder;

    final exhibitsSnap = await db
        .collectionGroup('exhibits')
        .orderBy(orderConfig.field, descending: !orderConfig.isAsc)
        .where('endDate', isGreaterThanOrEqualTo: date)
        .withExhibitConverter(this)
        .get();

    return exhibitsSnap.docs
        .map((docSnap) => docSnap.data())
        .where((exhibit) => !ignoreCreatorIds.contains(exhibit.creatorId))
        .toList();
  }

  @override
  Future<List<Product>> fetchProducts({
    required int limit,
    Product? lastProduct,
  }) async {
    final db = FirebaseFirestore.instance;
    final ignoreProductIds = await getIgnoreProductIds();
    final ignoreIdsLength = ignoreProductIds?.length ?? 0;
    final orderConfig = _config.productsOrder;

    final productsQuery = db
        .collectionGroup('products')
        .orderBy(orderConfig.field, descending: !orderConfig.isAsc)
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
            .limit(limit + ignoreIdsLength)
            .get();

        return querySnap.docs
            .map((docSnap) => docSnap.data())
            .where((p) => !(ignoreProductIds?.contains(p.id) ?? false))
            .toList();
      }
    }

    final querySnap = await productsQuery.limit(limit + ignoreIdsLength).get();
    return querySnap.docs
        .map((docSnap) => docSnap.data())
        .where((p) => !(ignoreProductIds?.contains(p.id) ?? false))
        .toList();
  }

  List<String> _ignoreProductIds = [];
  Future<List<String>?> getIgnoreProductIds() async {
    if (kDebugMode) {
      return null;
    }

    if (_ignoreProductIds.isNotEmpty) {
      return _ignoreProductIds;
    }

    final db = FirebaseFirestore.instance;
    final ignoreCreatorIds = _config.debugUserIds;

    final tasks = ignoreCreatorIds.map((creatorId) async {
      final querySnap = await db
          .collection('creators')
          .doc(creatorId)
          .collection('products')
          .get();
      return querySnap.docs.map((e) => e.id);
    });

    final productIds = await Future.wait(tasks);
    return _ignoreProductIds = productIds.expand((element) => element).toList();
  }
}
