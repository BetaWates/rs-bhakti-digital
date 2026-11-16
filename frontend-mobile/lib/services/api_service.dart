// ============================================================================
// RS Bhakti Digital SIMRS - Mobile API Service
// HTTP Client with configurable base URL, JWT storage & X-Client header
// ============================================================================

import 'dart:convert';
import 'dart:io' show Platform;
import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class ApiResponse {
  final bool success;
  final String message;
  final dynamic data;
  final int statusCode;

  ApiResponse({
    required this.success,
    required this.message,
    this.data,
    required this.statusCode,
  });
}

class ApiService {
  static const String _storageTokenKey = 'rsbhakti_mobile_token';
  static const String _storageUserKey = 'rsbhakti_mobile_user';
  static const String _storageBaseUrlKey = 'rsbhakti_mobile_base_url';

  // Optional compile-time environment override via --dart-define=API_BASE_URL=https://...
  static const String _envBaseUrl = String.fromEnvironment('API_BASE_URL');

  // Default base URL based on platform:
  // Android Emulator maps host machine localhost to 10.0.2.2
  static String get defaultBaseUrl {
    if (_envBaseUrl.isNotEmpty) {
      return _envBaseUrl.replaceAll(RegExp(r'/+$'), '');
    }
    if (kIsWeb) {
      return 'http://localhost:3001';
    }
    try {
      if (Platform.isAndroid) {
        return 'http://10.0.2.2:3001';
      }
    } catch (_) {}
    return 'http://localhost:3001';
  }

  static String _baseUrl = defaultBaseUrl;

  /// Active base URL
  static String get baseUrl => _baseUrl;

  /// Set the base URL in memory
  static void setBaseUrl(String url) {
    _baseUrl = url.trim().replaceAll(RegExp(r'/+$'), '');
  }

  /// Load persisted base URL from SharedPreferences
  static Future<void> loadBaseUrl() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final saved = prefs.getString(_storageBaseUrlKey);
      if (saved != null && saved.trim().isNotEmpty) {
        _baseUrl = saved.trim().replaceAll(RegExp(r'/+$'), '');
      }
    } catch (_) {}
  }

  /// Persist custom base URL to SharedPreferences
  static Future<void> saveBaseUrl(String url) async {
    setBaseUrl(url);
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString(_storageBaseUrlKey, _baseUrl);
    } catch (_) {}
  }

  /// Build standard headers including X-Client: mobile
  static Map<String, String> _buildHeaders({String? token}) {
    final headers = <String, String>{
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-Client': 'mobile',
    };
    if (token != null && token.isNotEmpty) {
      headers['Authorization'] = 'Bearer $token';
    }
    return headers;
  }

  // ---------------------------------------------------------------------------
  // Auth Token & Session Management
  // ---------------------------------------------------------------------------

  static Future<String?> getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_storageTokenKey);
  }

  static Future<void> saveToken(String token) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_storageTokenKey, token);
  }

  static Future<Map<String, dynamic>?> getUserData() async {
    final prefs = await SharedPreferences.getInstance();
    final jsonStr = prefs.getString(_storageUserKey);
    if (jsonStr != null && jsonStr.isNotEmpty) {
      try {
        return jsonDecode(jsonStr) as Map<String, dynamic>;
      } catch (_) {}
    }
    return null;
  }

  static Future<void> saveUserData(Map<String, dynamic> user) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_storageUserKey, jsonEncode(user));
  }

  static Future<void> clearAuth() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_storageTokenKey);
    await prefs.remove(_storageUserKey);
  }

  // ---------------------------------------------------------------------------
  // Authentication Endpoints
  // ---------------------------------------------------------------------------

  /// Login with email and password (POST /api/auth/login)
  static Future<ApiResponse> login(String email, String password) async {
    try {
      final uri = Uri.parse('$_baseUrl/api/auth/login');
      final response = await http.post(
        uri,
        headers: _buildHeaders(),
        body: jsonEncode({
          'email': email.trim(),
          'password': password,
        }),
      );

      final dynamic decoded = jsonDecode(response.body);
      final Map<String, dynamic> body = decoded is Map<String, dynamic> ? decoded : {};
      final bool success = response.statusCode == 200 && body['success'] == true;
      final String message = body['message'] as String? ??
          (success ? 'Login berhasil.' : 'Gagal masuk (Kode: ${response.statusCode})');

      if (success && body['data'] is Map<String, dynamic>) {
        final data = body['data'] as Map<String, dynamic>;
        final token = data['token'] as String?;
        if (token != null && token.isNotEmpty) {
          await saveToken(token);
        }
        if (data['user'] is Map<String, dynamic>) {
          await saveUserData(data['user'] as Map<String, dynamic>);
        }
      }

      return ApiResponse(
        success: success,
        message: message,
        data: body['data'],
        statusCode: response.statusCode,
      );
    } catch (e) {
      return ApiResponse(
        success: false,
        message: 'Tidak dapat terhubung ke server SIMRS: $e',
        statusCode: 0,
      );
    }
  }

  /// Register patient account (POST /api/auth/register-pasien)
  static Future<ApiResponse> registerPasien({
    required String name,
    required String email,
    required String password,
    required String phone,
  }) async {
    try {
      final uri = Uri.parse('$_baseUrl/api/auth/register-pasien');
      final response = await http.post(
        uri,
        headers: _buildHeaders(),
        body: jsonEncode({
          'name': name.trim(),
          'email': email.trim(),
          'password': password,
          'phone': phone.trim(),
        }),
      );

      final dynamic decoded = jsonDecode(response.body);
      final Map<String, dynamic> body = decoded is Map<String, dynamic> ? decoded : {};
      final bool success = response.statusCode == 201 || body['success'] == true;
      final String message = body['message'] as String? ??
          (success ? 'Pendaftaran berhasil.' : 'Pendaftaran gagal (Kode: ${response.statusCode})');

      return ApiResponse(
        success: success,
        message: message,
        data: body['data'],
        statusCode: response.statusCode,
      );
    } catch (e) {
      return ApiResponse(
        success: false,
        message: 'Tidak dapat terhubung ke server SIMRS: $e',
        statusCode: 0,
      );
    }
  }

  // ---------------------------------------------------------------------------
  // Patient Portal Endpoints (Scoped strictly to logged-in patient JWT)
  // ---------------------------------------------------------------------------

  /// Fetch consolidated patient dashboard payload (profile, active queue, appointments, history, bills)
  static Future<ApiResponse> getPatientDashboard() async {
    try {
      final token = await getToken();
      if (token == null || token.isEmpty) {
        return ApiResponse(
          success: false,
          message: 'Sesi login tidak ditemukan. Silakan login kembali.',
          statusCode: 401,
        );
      }

      final uri = Uri.parse('$_baseUrl/api/patient/dashboard');
      final response = await http.get(
        uri,
        headers: _buildHeaders(token: token),
      );

      final dynamic decoded = jsonDecode(response.body);
      final Map<String, dynamic> body = decoded is Map<String, dynamic> ? decoded : {};
      final bool success = response.statusCode == 200 && body['success'] == true;
      final String message = body['message'] as String? ??
          (success ? 'Dashboard berhasil dimuat.' : 'Gagal memuat dashboard (${response.statusCode})');

      return ApiResponse(
        success: success,
        message: message,
        data: body['data'],
        statusCode: response.statusCode,
      );
    } catch (e) {
      return ApiResponse(
        success: false,
        message: 'Tidak dapat terhubung ke server SIMRS: $e',
        statusCode: 0,
      );
    }
  }

  /// Fetch upcoming appointments / queue tickets
  static Future<ApiResponse> getPatientAppointments() async {
    try {
      final token = await getToken();
      final uri = Uri.parse('$_baseUrl/api/patient/appointments');
      final response = await http.get(uri, headers: _buildHeaders(token: token));
      final dynamic decoded = jsonDecode(response.body);
      final Map<String, dynamic> body = decoded is Map<String, dynamic> ? decoded : {};
      return ApiResponse(
        success: response.statusCode == 200 && body['success'] == true,
        message: body['message'] as String? ?? '',
        data: body['data'],
        statusCode: response.statusCode,
      );
    } catch (e) {
      return ApiResponse(success: false, message: '$e', statusCode: 0);
    }
  }

  /// Fetch clinical visit history
  static Future<ApiResponse> getPatientHistory() async {
    try {
      final token = await getToken();
      final uri = Uri.parse('$_baseUrl/api/patient/history');
      final response = await http.get(uri, headers: _buildHeaders(token: token));
      final dynamic decoded = jsonDecode(response.body);
      final Map<String, dynamic> body = decoded is Map<String, dynamic> ? decoded : {};
      return ApiResponse(
        success: response.statusCode == 200 && body['success'] == true,
        message: body['message'] as String? ?? '',
        data: body['data'],
        statusCode: response.statusCode,
      );
    } catch (e) {
      return ApiResponse(success: false, message: '$e', statusCode: 0);
    }
  }

  /// Fetch invoices & billing history
  static Future<ApiResponse> getPatientBills() async {
    try {
      final token = await getToken();
      final uri = Uri.parse('$_baseUrl/api/patient/bills');
      final response = await http.get(uri, headers: _buildHeaders(token: token));
      final dynamic decoded = jsonDecode(response.body);
      final Map<String, dynamic> body = decoded is Map<String, dynamic> ? decoded : {};
      return ApiResponse(
        success: response.statusCode == 200 && body['success'] == true,
        message: body['message'] as String? ?? '',
        data: body['data'],
        statusCode: response.statusCode,
      );
    } catch (e) {
      return ApiResponse(success: false, message: '$e', statusCode: 0);
    }
  }
}
