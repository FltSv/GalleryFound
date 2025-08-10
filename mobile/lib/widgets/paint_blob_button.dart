import 'package:flutter/material.dart';
import 'package:mobile/providers/navigate_provider.dart';

class ButtonProp {
  ButtonProp(this.icon, this.color, this.pos, this.screen);

  final IconData icon;
  final Color color;
  final Offset pos;
  final Widget? screen;
}

class PaintBlobButton extends StatelessWidget {
  const PaintBlobButton({
    super.key,
    required this.prop,
    required this.size,
  });

  final ButtonProp prop;
  final double size;

  @override
  Widget build(BuildContext context) {
    final isEnable = prop.screen != null;
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final ratio = isDark ? 0.2 : 0.3;
    final lerpColor = Color.lerp(prop.color, Colors.white, ratio) ?? prop.color;

    return GestureDetector(
      onTap: isEnable
          ? () {
              NavigateProvider.push(context, prop.screen!);
            }
          : null,
      child: Opacity(
        opacity: isEnable ? 1.0 : 0.5,
        child: Container(
          width: size,
          height: size,
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            gradient: RadialGradient(
              center: const Alignment(-0.2, -0.2),
              radius: 0.3,
              colors: [
                Colors.white.withValues(alpha: 0.8),
                lerpColor,
              ],
            ),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withValues(alpha: 0.2),
                blurRadius: 8,
                offset: const Offset(2, 4),
              ),
            ],
          ),
          child: Icon(
            prop.icon,
            size: size * 0.6,
            color: Colors.white,
          ),
        ),
      ),
    );
  }
}
