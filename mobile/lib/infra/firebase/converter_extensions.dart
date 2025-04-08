import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:mobile/models/creator.dart';
import 'package:mobile/models/exhibit.dart';
import 'package:mobile/models/gallery.dart';
import 'package:mobile/models/product.dart';
import 'package:mobile/repos/data_repo_base.dart';

typedef WithConverterType<T, R> = T Function({
  required FromFirestore<R> fromFirestore,
  required ToFirestore<R> toFirestore,
});

extension DocumentRefX on DocumentReference {
  DocumentReference<Creator> withCreatorConverter(DataRepoBase repo) =>
      _withCreatorConverter(withConverter, repo);

  DocumentReference<Product> withProductConverter(DataRepoBase repo) =>
      _withProductConverter(withConverter, repo);

  DocumentReference<Exhibit> withExhibitConverter(DataRepoBase repo) =>
      _withExhibitConverter(withConverter, repo);

  DocumentReference<Gallery> withGalleryConverter(DataRepoBase repo) =>
      _withGalleryConverter(withConverter, repo);
}

extension QueryX on Query {
  Query<Creator> withCreatorConverter(DataRepoBase repo) =>
      _withCreatorConverter(withConverter, repo);

  Query<Product> withProductConverter(DataRepoBase repo) =>
      _withProductConverter(withConverter, repo);

  Query<Exhibit> withExhibitConverter(DataRepoBase repo) =>
      _withExhibitConverter(withConverter, repo);

  Query<Gallery> withGalleryConverter(DataRepoBase repo) =>
      _withGalleryConverter(withConverter, repo);
}

T _withCreatorConverter<T>(
  WithConverterType<T, Creator> withConverter,
  DataRepoBase repo,
) {
  return withConverter(
    fromFirestore: (snapshot, _) {
      final data = snapshot.data()!;

      final profileHashtags =
          ((data['profileHashtags'] ?? <String>[]) as List<dynamic>)
              .cast<String>();

      final highlightProductId = data['highlightProductId'] as String?;

      final highlightProductPath = data['highlightProductThumbPath'] as String?;
      final highlightProductUrl = highlightProductPath != null
          ? repo.storageImageBaseUrl + highlightProductPath
          : null;

      return Creator(
        id: snapshot.id,
        name: toStr(data['name']),
        genre: toStr(data['genre']),
        profile: toStr(data['profile']),
        profileHashtags: profileHashtags,
        links: ((data['links'] ?? <String>[]) as List<dynamic>).cast<String>(),
        highlightProductId: highlightProductId,
        highlightProductUrl: highlightProductUrl,
      );
    },
    toFirestore: _readOnlyToFirestore(),
  );
}

T _withProductConverter<T>(
  WithConverterType<T, Product> withConverter,
  DataRepoBase repo,
) {
  return withConverter(
    fromFirestore: (snapshot, _) {
      final data = snapshot.data()!;
      return Product(
        id: toStr(data['id']),
        title: toStr(data['title']),
        detail: toStr(data['detail']),
        imagePath: data['imagePath'].toString(),
        thumbPath: data['thumbPath'].toString(),
      );
    },
    toFirestore: _readOnlyToFirestore(),
  );
}

T _withExhibitConverter<T>(
  WithConverterType<T, Exhibit> withConverter,
  DataRepoBase repo,
) {
  return withConverter(
    fromFirestore: (snapshot, _) {
      final data = snapshot.data()!;
      return Exhibit(
        id: toStr(data['id']),
        title: toStr(data['title']),
        location: toStr(data['location']),
        galleryId: toStr(data['galleryId']),
        imagePath: data['imagePath'].toString(),
        thumbPath: data['thumbPath'].toString(),
        startDate: toDateTime(data['startDate']),
        endDate: toDateTime(data['endDate']),
      );
    },
    toFirestore: _readOnlyToFirestore(),
  );
}

T _withGalleryConverter<T>(
  WithConverterType<T, Gallery> withConverter,
  DataRepoBase repo,
) {
  return withConverter(
    fromFirestore: (snapshot, _) {
      final data = snapshot.data()!;
      return Gallery(
        id: snapshot.id,
        name: toStr(data['name']),
        location: toStr(data['location']),
      );
    },
    toFirestore: _readOnlyToFirestore(),
  );
}

ToFirestore<T> _readOnlyToFirestore<T>() {
  return (value, _) => throw Exception('書込は許可されていません。');
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
