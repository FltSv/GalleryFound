import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:mobile/models/exhibit.dart';
import 'package:mobile/models/product.dart';
import 'package:mobile/repos/data_repo_base.dart';

typedef WithConverterType<T, R> = T Function({
  required FromFirestore<R> fromFirestore,
  required ToFirestore<R> toFirestore,
});

extension DocumentRefX on DocumentReference {
  DocumentReference<Product> withProductConverter(DataRepoBase repo) =>
      _withProductConverter(withConverter, repo);

  DocumentReference<Exhibit> withExhibitConverter(DataRepoBase repo) =>
      _withExhibitConverter(withConverter, repo);
}

extension QueryX on Query {
  Query<Product> withProductConverter(DataRepoBase repo) =>
      _withProductConverter(withConverter, repo);

  Query<Exhibit> withExhibitConverter(DataRepoBase repo) =>
      _withExhibitConverter(withConverter, repo);
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
        image: toStr(data['image']),
        fetchThumbUrl: repo.getThumbUrl,
      );
    },
    toFirestore: (product, _) => throw Exception('書込は許可されていません。'),
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
        image: toStr(data['image']),
        fetchThumbUrl: repo.getThumbUrl,
        startDate: toDateTime(data['startDate']),
        endDate: toDateTime(data['endDate']),
      );
    },
    toFirestore: (product, _) => throw Exception('書込は許可されていません。'),
  );
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
