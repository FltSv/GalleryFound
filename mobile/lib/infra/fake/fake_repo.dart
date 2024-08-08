import 'package:mobile/models/creator.dart';
import 'package:mobile/models/exhibit.dart';
import 'package:mobile/models/product.dart';
import 'package:mobile/repos/data_repo_base.dart';

class FakeRepo implements DataRepoBase {
  @override
  Future<List<Creator>> fetchCreators() {
    return Future.value([
      Creator(
        id: "nkRObVdYriU5AolyNxJy5pIDKEs2",
        name: "suna",
        products: [
          Product(
            id: "10043286-3072-49b8-a04a-83b9b1f790f5",
            image:
                "9887707f-ac43-43bd-9015-2f112df57576.png?alt=media&token=10b319a5-8349-4fb1-959e-4d50d05cfb6f",
          ),
          Product(
            id: "4eb84461-3664-480c-b89d-77dc401bb0e5",
            image:
                "b6f6a0a2-7f23-4f66-9959-9c9ee7d8f521.png?alt=media&token=6760976d-be3a-4da3-a0a8-15e1adf596b9",
          ),
        ],
        exhibits: [
          Exhibit(
            id: "test-id",
            title: "ひまろり",
            location: "スペースくらげ",
            galleryId: "2sBP7J67oggejHsPE4Z1",
            image:
                "e3f7f1f0-a302-4301-b13d-268b2253ff81.png?alt=media&token=dfa0ba77-4f30-4e1e-a662-09de94c93251",
            startDate: DateTime(2024, 7, 3, 0),
            endDate: DateTime(2024, 7, 3, 23),
          ),
          Exhibit(
            id: "01J1E3FS0PQDNVDD20QWMM467M",
            title: "neko",
            location: "ネコカフェ",
            galleryId: "01J1V23TZ35C5BRTJATJZRRMPH",
            image:
                "01J1E3G2KXZ79YWGX0B7Q3YRZV.png?alt=media&token=2f66e11e-ed02-4b39-b8ac-4676f0e00adb",
            startDate: DateTime(2024, 7, 2, 0),
            endDate: DateTime(2024, 7, 4, 23),
          ),
        ],
      ),
      Creator(
        id: "cWp162TEn9MrXVUqifEmRJ22nyx1",
        name: "ノゾミ",
        products: [
          Product(
            id: "43a0e71b-9761-4800-9e88-1a57a3a4ed53",
            image:
                "46ff0e7f-b781-4694-bb0d-cf94ce3aa2fa.png?alt=media&token=f2f8f802-c85b-464e-8de8-8a29468c74c8",
          ),
          Product(
            id: "d94c32a0-e82e-41b8-af6e-4c61ce4a065b",
            image:
                "9ee21a8a-ff5c-4d1b-aaf5-25cc81905331.png?alt=media&token=4d143a04-e267-47de-b38e-4ad2ad318439",
          ),
        ],
        exhibits: [
          Exhibit(
            id: "1c53ca10-1220-4d12-b68c-b0a35a1820df",
            title: "うにゃ～",
            location: "スペースくらげ",
            galleryId: "2sBP7J67oggejHsPE4Z1",
            image:
                "01J1ZQTRPS8JNCM8Z5SKB5NPBT.png?alt=media&token=46e1f8da-49ae-41cf-b6a7-e82fc06d0e0c",
            startDate: DateTime(2024, 3, 13, 0),
            endDate: DateTime(2024, 3, 28, 0),
          ),
        ],
      ),
    ]);
  }

  @override
  String getImageUrl(String userId, String image) {
    const domain =
        "firebasestorage.googleapis.com/v0/b/gallery-found.appspot.com";
    return "https://$domain/o/creators%2F$userId%2F$image";
  }
}
