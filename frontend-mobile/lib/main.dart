// ============================================================================
// RS Bhakti Digital SIMRS - Flutter Mobile Application
// Cross-Platform Patient Portal & Healthcare Staff Mobile Companion
// ============================================================================

import 'package:flutter/material.dart';
import 'screens/splash_screen.dart';
import 'screens/login_screen.dart';
import 'screens/patient_dashboard.dart';
import 'screens/nakes_dashboard.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const RSBhaktiApp());
}

class RSBhaktiApp extends StatelessWidget {
  const RSBhaktiApp({super.key});

  @override
  Widget build(BuildContext context) {
    const primaryTeal = Color(0xFF0D9488);
    const darkNavy = Color(0xFF0D1B2E);

    return MaterialApp(
      title: 'RS Bhakti Digital',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        useMaterial3: true,
        colorScheme: ColorScheme.fromSeed(
          seedColor: primaryTeal,
          primary: primaryTeal,
          secondary: darkNavy,
          background: const Color(0xFFF8FAFC),
        ),
        fontFamily: 'Roboto',
        appBarTheme: const AppBarTheme(
          backgroundColor: Colors.white,
          foregroundColor: darkNavy,
          elevation: 0.5,
          centerTitle: false,
        ),
      ),
      initialRoute: '/',
      routes: {
        '/': (context) => const MobileSplashScreen(),
        '/login': (context) => const MobileLoginScreen(),
        '/patient': (context) => const PatientDashboardScreen(),
        '/nakes': (context) => const NakesDashboardScreen(),
      },
    );
  }
}
