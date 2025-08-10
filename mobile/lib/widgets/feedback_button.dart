import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';

class FeedbackButton extends StatelessWidget {
  const FeedbackButton({super.key});

  static const String feedbackUrl = 'https://forms.gle/1NQouur9PhdSyf1z5';

  Future<void> _launchFeedbackForm() async {
    final url = Uri.parse(feedbackUrl);
    if (!await launchUrl(url)) {
      throw ArgumentError('Could not launch $url');
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return ElevatedButton.icon(
      onPressed: _launchFeedbackForm,
      icon: Icon(
        Icons.feedback_outlined,
        color: theme.colorScheme.onPrimaryContainer,
      ),
      label: const Text('フィードバックはこちらから'),
      style: ElevatedButton.styleFrom(
        backgroundColor: theme.colorScheme.primaryContainer,
        foregroundColor: theme.colorScheme.onPrimaryContainer,
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
        ),
      ),
    );
  }
}
