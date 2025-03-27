import 'package:flutter/material.dart';
import 'package:gap/gap.dart';
import 'package:mobile/models/creator.dart';
import 'package:mobile/providers/navigate_provider.dart';
import 'package:mobile/screens/creator_detail_screen.dart';
import 'package:mobile/widgets/thumb_image.dart';

class CreatorLink extends StatelessWidget {
  const CreatorLink({
    super.key,
    required this.creator,
  });

  static const double avatarSize = 48;

  final Creator creator;

  @override
  Widget build(BuildContext context) {
    final product = creator.highlightProduct;

    return InkWell(
      onTap: () {
        NavigateProvider.push(
          context,
          CreatorDetailScreen(creator: creator),
        );
      },
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: 8),
        child: Row(
          children: [
            // 代表作品のアイコン
            SizedBox(
              width: avatarSize,
              height: avatarSize,
              child: ClipOval(
                child: product != null
                    ? ThumbImage(
                        imageBase: product,
                        fit: BoxFit.cover,
                      )
                    : ColoredBox(
                        color: Colors.grey.shade300,
                        child: const Icon(
                          Icons.person,
                          color: Colors.grey,
                          size: 32,
                        ),
                      ),
              ),
            ),

            const Gap(12),

            // Creator名
            Expanded(
              child: Text(
                creator.name,
                style: Theme.of(context)
                    .textTheme
                    .titleMedium
                    ?.copyWith(fontWeight: FontWeight.bold),
              ),
            ),
            const Icon(Icons.chevron_right),
          ],
        ),
      ),
    );
  }
}
