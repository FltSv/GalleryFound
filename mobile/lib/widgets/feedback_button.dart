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
    return Positioned(
      bottom: 32,
      right: 32,
      child: ElevatedButton.icon(
        onPressed: _launchFeedbackForm,
        icon: const Icon(Icons.feedback_outlined),
        label: const Text('フィードバックはこちらから'),
        style: ElevatedButton.styleFrom(
          backgroundColor: const Color(0xFFbb67bf),
          foregroundColor: Colors.white,
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
        ),
      ),
    );
  }
}
