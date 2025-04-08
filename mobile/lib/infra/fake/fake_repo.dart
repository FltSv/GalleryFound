// ignore_for_file: lines_longer_than_80_chars

import 'package:mobile/models/book.dart';
import 'package:mobile/models/creator.dart';
import 'package:mobile/models/exhibit.dart';
import 'package:mobile/models/gallery.dart';
import 'package:mobile/models/product.dart';
import 'package:mobile/repos/data_repo_base.dart';

class FakeRepo implements DataRepoBase {
  @override
  Future<List<Creator>> fetchCreators() {
    return Future.value([
      Creator(
        id: 'nkRObVdYriU5AolyNxJy5pIDKEs2',
        name: 'suna',
        genre: 'デジタル',
        profile: 'すなプロフィール',
        profileHashtags: [],
        links: ['https://mstdn.jp/@fltsv', 'https://mstdn.jp/@himarori'],
        highlightProductId: '10043286-3072-49b8-a04a-83b9b1f790f5',
        highlightProductUrl:
            'nkRObVdYriU5AolyNxJy5pIDKEs2/thumbs/9887707f-ac43-43bd-9015-2f112df57576.webp',
      ),
      Creator(
        id: 'cWp162TEn9MrXVUqifEmRJ22nyx1',
        name: 'ノゾミ',
        genre: null,
        profile: 'ふぁぴ\n\n\n\nhttps://lit.link/choco78',
        profileHashtags: [],
        links: [
          'https://x.com/mi_oilacrylart',
          'https://x.com/utsukikuroko',
          'https://misskey.m544.net/@choco',
        ],
        highlightProductId: '43a0e71b-9761-4800-9e88-1a57a3a4ed53',
        highlightProductUrl:
            'cWp162TEn9MrXVUqifEmRJ22nyx1/thumbs/46ff0e7f-b781-4694-bb0d-cf94ce3aa2fa.webp',
      ),
    ]);
  }

  @override
  Future<Creator> fetchCreatorById(String creatorId) async {
    final creators = await fetchCreators();
    final creator = creators.firstWhere(
      (creator) => creator.id == creatorId,
      orElse: () => throw Exception('CreatorId "$creatorId" is not found.'),
    );
    return creator;
  }

  @override
  String get storageImageBaseUrl =>
      'https://firebasestorage.googleapis.com/v0/b/gallery-found.appspot.com/o/creators%2F';

  static Future<List<Book>> fetchBooks() {
    return Future.value([
      Book(
        id: '1',
        title: 'ひまわり',
        image:
            'https://media.mstdn.jp/accounts/avatars/110/989/102/133/377/139/original/ef63d785a819a2f2.png',
        urls: ['https://mstdn.jp/@himarori'],
      ),
      Book(
        id: '2',
        title: '砂ちゃん',
        image:
            'https://media.mstdn.jp/accounts/avatars/000/113/775/original/4a94c289c389d678.jpg',
        urls: ['https://mstdn.jp/@fltsv', 'https://mstdn.jp/@himarori'],
      ),
      Book(
        id: '3',
        title: 'よるねこ',
        image:
            'https://media.mstdn.jp/accounts/avatars/000/155/200/original/2e948193ee954e55428290ad6ecada7f.png',
        urls: [
          'https://mstdn.jp/@NightCat',
          'https://mstdn.jp/@himarori',
          'https://mstdn.jp/@fltsv',
        ],
      ),
      Book(
        id: '4',
        title: 'もやちゃ',
        image:
            'https://media.mstdn.jp/accounts/avatars/109/719/600/512/825/943/original/898331de566f6f5e.png',
        urls: [
          'https://mstdn.jp/@kisskamakiri',
          'https://mstdn.jp/@fltsv',
          'https://mstdn.jp/@NightCat',
          'https://mstdn.jp/@himarori',
        ],
      ),
    ]);
  }

  @override
  Future<List<Gallery>> fetchGalleries() {
    return Future.value([
      Gallery(
        id: 'nkRObVdYriU5AolyNxJy5pIDKEs3',
        name: '皇居',
        location: '東京都千代田区千代田1-1',
      ),
    ]);
  }

  @override
  Future<Gallery> fetchGalleryById(String galleryId) async {
    final galleries = await fetchGalleries();
    return galleries.firstWhere((gallery) => gallery.id == galleryId);
  }

  @override
  Future<List<Exhibit>> fetchCreatorExhibits(Creator creator) async {
    return [
      Exhibit(
        id: 'test-id',
        title: 'ひまろり',
        location: 'スペースくらげ',
        galleryId: '2sBP7J67oggejHsPE4Z1',
        imagePath:
            'nkRObVdYriU5AolyNxJy5pIDKEs2/9887707f-ac43-43bd-9015-2f112df57576.png?alt=media&token=10b319a5-8349-4fb1-959e-4d50d05cfb6f',
        thumbPath:
            'nkRObVdYriU5AolyNxJy5pIDKEs2/thumbs/9887707f-ac43-43bd-9015-2f112df57576.webp',
        startDate: DateTime(2024, 7, 3),
        endDate: DateTime(2024, 7, 3, 23),
        creatorId: creator.id,
      ),
      Exhibit(
        id: '01J1E3FS0PQDNVDD20QWMM467M',
        title: 'neko',
        location: 'ネコカフェ',
        galleryId: '01J1V23TZ35C5BRTJATJZRRMPH',
        imagePath:
            'nkRObVdYriU5AolyNxJy5pIDKEs2/9887707f-ac43-43bd-9015-2f112df57576.png?alt=media&token=10b319a5-8349-4fb1-959e-4d50d05cfb6f',
        thumbPath:
            'nkRObVdYriU5AolyNxJy5pIDKEs2/thumbs/9887707f-ac43-43bd-9015-2f112df57576.webp',
        startDate: DateTime(2024, 7, 2),
        endDate: DateTime(2024, 7, 4, 23),
        creatorId: creator.id,
      ),
      Exhibit(
        id: '1c53ca10-1220-4d12-b68c-b0a35a1820df',
        title: 'うにゃ～',
        location: 'スペースくらげ',
        galleryId: '2sBP7J67oggejHsPE4Z1',
        imagePath:
            'nkRObVdYriU5AolyNxJy5pIDKEs2/9887707f-ac43-43bd-9015-2f112df57576.png?alt=media&token=10b319a5-8349-4fb1-959e-4d50d05cfb6f',
        thumbPath:
            'nkRObVdYriU5AolyNxJy5pIDKEs2/thumbs/9887707f-ac43-43bd-9015-2f112df57576.webp',
        startDate: DateTime(2024, 3, 13),
        endDate: DateTime(2024, 3, 28),
        creatorId: creator.id,
      ),
    ];
  }

  @override
  Future<List<Product>> fetchCreatorProducts(Creator creator) async {
    return [
      Product(
        id: '10043286-3072-49b8-a04a-83b9b1f790f5',
        title: 'ねこ',
        detail: 'ねこ説明',
        imagePath:
            'nkRObVdYriU5AolyNxJy5pIDKEs2/9887707f-ac43-43bd-9015-2f112df57576.png?alt=media&token=10b319a5-8349-4fb1-959e-4d50d05cfb6f',
        thumbPath:
            'nkRObVdYriU5AolyNxJy5pIDKEs2/thumbs/9887707f-ac43-43bd-9015-2f112df57576.webp',
        creatorId: creator.id,
      ),
      Product(
        id: '4eb84461-3664-480c-b89d-77dc401bb0e5',
        title: '',
        detail: '',
        imagePath:
            'cWp162TEn9MrXVUqifEmRJ22nyx1/46ff0e7f-b781-4694-bb0d-cf94ce3aa2fa.png?alt=media&token=f2f8f802-c85b-464e-8de8-8a29468c74c8',
        thumbPath:
            'cWp162TEn9MrXVUqifEmRJ22nyx1/thumbs/46ff0e7f-b781-4694-bb0d-cf94ce3aa2fa.webp',
        creatorId: creator.id,
      ),
      Product(
        id: '43a0e71b-9761-4800-9e88-1a57a3a4ed53',
        title: '',
        detail: '',
        imagePath:
            'cWp162TEn9MrXVUqifEmRJ22nyx1/46ff0e7f-b781-4694-bb0d-cf94ce3aa2fa.png?alt=media&token=f2f8f802-c85b-464e-8de8-8a29468c74c8',
        thumbPath:
            'cWp162TEn9MrXVUqifEmRJ22nyx1/thumbs/46ff0e7f-b781-4694-bb0d-cf94ce3aa2fa.webp',
        creatorId: creator.id,
      ),
      Product(
        id: 'd94c32a0-e82e-41b8-af6e-4c61ce4a065b',
        title: '',
        detail: '',
        imagePath:
            'nkRObVdYriU5AolyNxJy5pIDKEs2/9887707f-ac43-43bd-9015-2f112df57576.png?alt=media&token=10b319a5-8349-4fb1-959e-4d50d05cfb6f',
        thumbPath:
            'nkRObVdYriU5AolyNxJy5pIDKEs2/thumbs/9887707f-ac43-43bd-9015-2f112df57576.webp',
        creatorId: creator.id,
      ),
    ];
  }

  @override
  Future<List<Exhibit>> fetchExhibitsAfterDate(
    DateTime date,
  ) async {
    final creator = await fetchCreatorById('nkRObVdYriU5AolyNxJy5pIDKEs2');
    final exhibits = await fetchCreatorExhibits(creator);
    return exhibits.where((exhibit) => exhibit.endDate.isAfter(date)).toList();
  }

  @override
  Future<List<Product>> fetchProducts({
    required int limit,
    Product? lastProduct,
  }) {
    // TODO(suna): implement fetchProducts
    throw UnimplementedError();
  }
}
