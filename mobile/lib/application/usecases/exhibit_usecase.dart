import 'package:mobile/models/exhibit.dart';
import 'package:mobile/models/gallery.dart';
import 'package:mobile/providers/data_provider.dart';
import 'package:mobile/repos/data_repo_base.dart';

class ExhibitUsecase {
  ExhibitUsecase(this._repo);

  final DataRepoBase _repo;

  Future<List<(Exhibit, Gallery)>> fetchExhibits(DateTime date) async {
    final creators = DataProvider().creators;
    final exhibits = await _repo.fetchExhibitsAfterDate(date, creators);

    final tasks = exhibits.map((exhibits) async {
      final gallery = await _repo.fetchGalleryById(exhibits.galleryId);
      return (exhibits, gallery);
    });

    return Future.wait(tasks);
  }
}
