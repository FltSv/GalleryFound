import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:mobile/services/debug_db_service.dart';

/// デバッグモード時のみ表示される開発DB切り替えボタン
class DebugDBButton extends ConsumerStatefulWidget {
  const DebugDBButton({super.key});

  @override
  ConsumerState<DebugDBButton> createState() => _DebugDBButtonState();
}

class _DebugDBButtonState extends ConsumerState<DebugDBButton> {
  bool _isDevelopDB = false;
  bool _isRebootPending = false;

  @override
  void initState() {
    super.initState();
    _loadDevelopDBStatus();
  }

  Future<void> _loadDevelopDBStatus() async {
    if (kDebugMode) {
      final service = ref.read(debugDBServiceProvider);
      final isEnabled = await service.isDevelopDBEnabled();
      setState(() {
        _isDevelopDB = isEnabled;
      });
    }
  }

  Future<void> _toggleDevelopDB() async {
    if (kDebugMode) {
      final service = ref.read(debugDBServiceProvider);
      final newValue = await service.toggleDevelopDB();

      setState(() {
        _isDevelopDB = newValue;
        _isRebootPending = true;
      });

      // DBの切り替えを反映するためにアプリの再起動が必要なことをユーザーに通知
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text(
              'developDBを切り替えました。変更を反映するにはアプリを再起動してください。',
            ),
            duration: Duration(days: 1),
          ),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return ElevatedButton.icon(
      icon: Icon(
        _isRebootPending
            ? Icons.refresh
            : (_isDevelopDB ? Icons.bug_report : Icons.bug_report_outlined),
      ),
      label: Text(
        _isRebootPending
            ? '再起動が必要です'
            : (_isDevelopDB ? 'DevelopDB: ON' : 'DevelopDB: OFF'),
      ),
      style: ElevatedButton.styleFrom(
        backgroundColor: _isDevelopDB ? Colors.red : Colors.grey,
        foregroundColor: Colors.white,
      ),
      onPressed: _isRebootPending ? null : _toggleDevelopDB,
    );
  }
}
