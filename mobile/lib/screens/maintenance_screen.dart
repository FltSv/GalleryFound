import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:gap/gap.dart';
import 'package:intersperse/intersperse.dart';

class MaintenanceScreen extends ConsumerWidget {
  const MaintenanceScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final theme = Theme.of(context);

    return Scaffold(
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(
              'ただいまメンテナンス中です',
              style: theme.textTheme.headlineSmall?.copyWith(
                color: theme.colorScheme.primary,
                fontWeight: FontWeight.bold,
              ),
              textAlign: TextAlign.center,
            ),
            const Gap(1),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 32),
              child: Text(
                'ご迷惑をおかけしております。\n現在、メンテナンスを実施しております。\n'
                '恐れ入りますが、しばらく時間をおいてから再度アクセスしていただくようお願いします。',
                style: theme.textTheme.bodyLarge,
                textAlign: TextAlign.center,
              ),
            ),
          ].intersperse(const Gap(16)).toList(),
        ),
      ),
    );
  }
}
