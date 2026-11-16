import 'package:flutter/material.dart';
import '../services/api_service.dart';

class PatientDashboardScreen extends StatefulWidget {
  const PatientDashboardScreen({super.key});

  @override
  State<PatientDashboardScreen> createState() => _PatientDashboardScreenState();
}

class _PatientDashboardScreenState extends State<PatientDashboardScreen> {
  bool _isLoading = true;
  String? _errorMessage;
  Map<String, dynamic>? _dashboardData;

  @override
  void initState() {
    super.initState();
    _fetchDashboard();
  }

  Future<void> _fetchDashboard() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    final res = await ApiService.getPatientDashboard();

    if (!mounted) return;

    if (res.success && res.data is Map<String, dynamic>) {
      setState(() {
        _isLoading = false;
        _dashboardData = res.data as Map<String, dynamic>;
      });
    } else {
      setState(() {
        _isLoading = false;
        _errorMessage = res.message.isNotEmpty
            ? res.message
            : 'Terjadi kesalahan saat memuat data pasien.';
      });
    }
  }

  Future<void> _handleLogout() async {
    await ApiService.clearAuth();
    if (mounted) {
      Navigator.of(context).pushReplacementNamed('/login');
    }
  }

  void _showHistoryModal(List<dynamic> history) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (ctx) => DraggableScrollableSheet(
        initialChildSize: 0.7,
        maxChildSize: 0.9,
        minChildSize: 0.4,
        expand: false,
        builder: (_, scrollController) => Padding(
          padding: const EdgeInsets.all(20.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Center(
                child: Container(
                  width: 40,
                  height: 4,
                  decoration: BoxDecoration(
                    color: Colors.grey[300],
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
              ),
              const SizedBox(height: 16),
              const Row(
                children: [
                  Icon(Icons.history_edu_outlined, color: Color(0xFF0D9488)),
                  SizedBox(width: 8),
                  Text(
                    'Riwayat Rekam Medis & Kunjungan',
                    style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                  ),
                ],
              ),
              const SizedBox(height: 16),
              Expanded(
                child: history.isEmpty
                    ? const Center(
                        child: Text(
                          'Belum ada riwayat rekam medis.',
                          style: TextStyle(color: Colors.grey),
                        ),
                      )
                    : ListView.separated(
                        controller: scrollController,
                        itemCount: history.length,
                        separatorBuilder: (_, __) => const SizedBox(height: 12),
                        itemBuilder: (_, idx) {
                          final item = history[idx] as Map<String, dynamic>;
                          final doc = item['doctor'] as Map<String, dynamic>?;
                          return Container(
                            padding: const EdgeInsets.all(14),
                            decoration: BoxDecoration(
                              color: const Color(0xFFF8FAFC),
                              borderRadius: BorderRadius.circular(12),
                              border: Border.all(color: const Color(0xFFE2E8F0)),
                            ),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Row(
                                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                  children: [
                                    Expanded(
                                      child: Text(
                                        item['diagnosa'] ?? 'Pemeriksaan Rutin',
                                        style: const TextStyle(
                                          fontWeight: FontWeight.bold,
                                          fontSize: 14,
                                          color: Color(0xFF0F172A),
                                        ),
                                      ),
                                    ),
                                    Text(
                                      (item['createdAt'] as String?)?.split('T')[0] ?? '-',
                                      style: const TextStyle(fontSize: 11, color: Colors.grey),
                                    ),
                                  ],
                                ),
                                const SizedBox(height: 6),
                                Text(
                                  'Keluhan: ${item['keluhan_utama'] ?? '-'}',
                                  style: const TextStyle(fontSize: 12, color: Color(0xFF334155)),
                                ),
                                const SizedBox(height: 4),
                                Text(
                                  'Tindakan: ${item['tindakan'] ?? '-'}',
                                  style: const TextStyle(fontSize: 12, color: Color(0xFF64748B)),
                                ),
                                if (doc != null) ...[
                                  const SizedBox(height: 6),
                                  Row(
                                    children: [
                                      const Icon(Icons.person_outline, size: 14, color: Color(0xFF0D9488)),
                                      const SizedBox(width: 4),
                                      Text(
                                        doc['nama_dokter'] ?? '-',
                                        style: const TextStyle(
                                          fontSize: 11,
                                          fontWeight: FontWeight.w600,
                                          color: Color(0xFF0D9488),
                                        ),
                                      ),
                                    ],
                                  ),
                                ],
                              ],
                            ),
                          );
                        },
                      ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  void _showBillsModal(List<dynamic> bills) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (ctx) => DraggableScrollableSheet(
        initialChildSize: 0.7,
        maxChildSize: 0.9,
        minChildSize: 0.4,
        expand: false,
        builder: (_, scrollController) => Padding(
          padding: const EdgeInsets.all(20.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Center(
                child: Container(
                  width: 40,
                  height: 4,
                  decoration: BoxDecoration(
                    color: Colors.grey[300],
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
              ),
              const SizedBox(height: 16),
              const Row(
                children: [
                  Icon(Icons.receipt_long_outlined, color: Color(0xFF0D9488)),
                  SizedBox(width: 8),
                  Text(
                    'Tagihan & Rincian Biaya Rumah Sakit',
                    style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                  ),
                ],
              ),
              const SizedBox(height: 16),
              Expanded(
                child: bills.isEmpty
                    ? const Center(
                        child: Text(
                          'Tidak ada catatan tagihan saat ini.',
                          style: TextStyle(color: Colors.grey),
                        ),
                      )
                    : ListView.separated(
                        controller: scrollController,
                        itemCount: bills.length,
                        separatorBuilder: (_, __) => const SizedBox(height: 12),
                        itemBuilder: (_, idx) {
                          final item = bills[idx] as Map<String, dynamic>;
                          final status = (item['status_pembayaran'] as String?) ?? 'pending';
                          final isPaid = status == 'dibayar' || status == 'klaim_bpjs';

                          return Container(
                            padding: const EdgeInsets.all(14),
                            decoration: BoxDecoration(
                              color: const Color(0xFFF8FAFC),
                              borderRadius: BorderRadius.circular(12),
                              border: Border.all(color: const Color(0xFFE2E8F0)),
                            ),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Row(
                                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                  children: [
                                    Text(
                                      'Invoice #${item['id'] ?? '-'}',
                                      style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
                                    ),
                                    Container(
                                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                                      decoration: BoxDecoration(
                                        color: isPaid ? const Color(0xFFDCFCE7) : const Color(0xFFFEF3C7),
                                        borderRadius: BorderRadius.circular(8),
                                      ),
                                      child: Text(
                                        status == 'klaim_bpjs'
                                            ? 'Cover BPJS'
                                            : (status == 'dibayar' ? 'Lunas' : 'Menunggu Bayar'),
                                        style: TextStyle(
                                          fontSize: 10,
                                          fontWeight: FontWeight.bold,
                                          color: isPaid ? const Color(0xFF166534) : const Color(0xFF92400E),
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                                const SizedBox(height: 10),
                                Row(
                                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                  children: [
                                    const Text('Total Biaya:', style: TextStyle(fontSize: 12, color: Colors.grey)),
                                    Text(
                                      'Rp ${item['total_biaya'] ?? 0}',
                                      style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
                                    ),
                                  ],
                                ),
                                const SizedBox(height: 4),
                                Row(
                                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                  children: [
                                    const Text('Cover Asuransi/BPJS:', style: TextStyle(fontSize: 12, color: Colors.grey)),
                                    Text(
                                      'Rp ${item['cover_bpjs'] ?? 0}',
                                      style: const TextStyle(fontSize: 12, color: Color(0xFF16A34A)),
                                    ),
                                  ],
                                ),
                                const Divider(height: 16),
                                Row(
                                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                  children: [
                                    const Text('Sisa Bayar Pasien:', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                                    Text(
                                      'Rp ${item['sisa_bayar_pasien'] ?? 0}',
                                      style: const TextStyle(
                                        fontSize: 14,
                                        fontWeight: FontWeight.bold,
                                        color: Color(0xFF0D9488),
                                      ),
                                    ),
                                  ],
                                ),
                              ],
                            ),
                          );
                        },
                      ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    const primaryTeal = Color(0xFF0D9488);

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        title: const Text(
          'Portal Pasien RS Bhakti Digital',
          style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
        ),
        actions: [
          IconButton(
            tooltip: 'Segarkan Data',
            icon: const Icon(Icons.refresh_rounded),
            onPressed: _fetchDashboard,
          ),
          IconButton(
            tooltip: 'Keluar Akun',
            icon: const Icon(Icons.logout_rounded),
            onPressed: _handleLogout,
          ),
        ],
      ),
      body: _buildBody(primaryTeal),
    );
  }

  Widget _buildBody(Color primaryTeal) {
    if (_isLoading) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            CircularProgressIndicator(color: primaryTeal),
            const SizedBox(height: 16),
            const Text(
              'Memuat data rekam medis pasien...',
              style: TextStyle(color: Color(0xFF64748B), fontSize: 13),
            ),
          ],
        ),
      );
    }

    if (_errorMessage != null) {
      return Center(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Container(
                padding: const EdgeInsets.all(16),
                decoration: const BoxDecoration(
                  color: Color(0xFFFEF2F2),
                  shape: BoxShape.circle,
                ),
                child: const Icon(Icons.error_outline_rounded, color: Color(0xFFDC2626), size: 48),
              ),
              const SizedBox(height: 16),
              const Text(
                'Gagal Memuat Data',
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Color(0xFF0F172A)),
              ),
              const SizedBox(height: 8),
              Text(
                _errorMessage!,
                textAlign: TextAlign.center,
                style: const TextStyle(fontSize: 13, color: Color(0xFF64748B)),
              ),
              const SizedBox(height: 20),
              ElevatedButton.icon(
                onPressed: _fetchDashboard,
                icon: const Icon(Icons.refresh_rounded, size: 18),
                label: const Text('Coba Lagi'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: primaryTeal,
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                ),
              ),
            ],
          ),
        ),
      );
    }

    final data = _dashboardData ?? {};
    final profile = data['profile'] as Map<String, dynamic>? ?? {};
    final activeQueue = data['activeQueue'] as Map<String, dynamic>?;
    final appointments = (data['appointments'] as List<dynamic>?) ?? [];
    final history = (data['history'] as List<dynamic>?) ?? [];
    final bills = (data['bills'] as List<dynamic>?) ?? [];

    final hasBpjs = profile['no_bpjs'] != null && (profile['no_bpjs'] as String).isNotEmpty;

    return RefreshIndicator(
      color: primaryTeal,
      onRefresh: _fetchDashboard,
      child: SingleChildScrollView(
        physics: const AlwaysScrollableScrollPhysics(),
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Patient Info Card with BPJS badge
            Card(
              elevation: 0,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(16),
                side: const BorderSide(color: Color(0xFFE2E8F0)),
              ),
              color: const Color(0xFFF0FDF4),
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Row(
                  children: [
                    CircleAvatar(
                      radius: 28,
                      backgroundColor: primaryTeal.withOpacity(0.2),
                      child: const Icon(Icons.person, color: primaryTeal, size: 32),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            profile['nama_lengkap'] ?? 'Pasien SIMRS',
                            style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            'No. RM: ${profile['no_rm'] ?? '-'} · NIK: ${profile['nik'] ?? '-'}',
                            style: const TextStyle(fontSize: 11, color: Color(0xFF475569)),
                          ),
                          const SizedBox(height: 6),
                          Row(
                            children: [
                              Chip(
                                label: Text(
                                  hasBpjs
                                      ? 'BPJS Kesehatan - Kelas ${profile['kelas_bpjs'] ?? '1'}'
                                      : 'Pasien Umum Mandiri',
                                  style: TextStyle(
                                    fontSize: 10,
                                    color: hasBpjs ? Colors.green[800] : Colors.blue[800],
                                    fontWeight: FontWeight.w600,
                                  ),
                                ),
                                backgroundColor: Colors.white,
                                padding: EdgeInsets.zero,
                                materialTapTargetSize: MaterialTapTargetSize.shrinkWrap,
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 20),

            // Active Queue Ticket Card
            const Text('Antrean Aktif Hari Ini', style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold)),
            const SizedBox(height: 10),
            if (activeQueue != null) ...[
              Card(
                elevation: 2,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                child: Container(
                  padding: const EdgeInsets.all(18),
                  decoration: BoxDecoration(
                    gradient: const LinearGradient(
                      colors: [Color(0xFF0D9488), Color(0xFF14B8A6)],
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                    ),
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: Column(
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            activeQueue['doctor']?['spesialisasi'] ?? 'Poli Rawat Jalan',
                            style: const TextStyle(color: Colors.white70, fontSize: 12),
                          ),
                          Text(
                            'Status: ${activeQueue['status']?.toString().toUpperCase() ?? 'MENUNGGU'}',
                            style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 11),
                          ),
                        ],
                      ),
                      const SizedBox(height: 14),
                      Text(
                        activeQueue['nomor_antrean'] ?? '-',
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 36,
                          fontWeight: FontWeight.bold,
                          letterSpacing: 2,
                        ),
                      ),
                      const SizedBox(height: 6),
                      Text(
                        activeQueue['doctor']?['nama_dokter'] ?? 'Dokter Pemeriksa',
                        style: const TextStyle(color: Colors.white, fontSize: 12),
                      ),
                      const Divider(color: Colors.white30, height: 24),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Text('Tanggal Periksa:', style: TextStyle(color: Colors.white70, fontSize: 11)),
                          Text(
                            (activeQueue['tanggal_periksa'] as String?)?.split('T')[0] ?? 'Hari Ini',
                            style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 12),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
            ] else ...[
              Card(
                elevation: 0,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(14),
                  side: const BorderSide(color: Color(0xFFE2E8F0)),
                ),
                color: Colors.white,
                child: const Padding(
                  padding: EdgeInsets.symmetric(horizontal: 16, vertical: 20),
                  child: Row(
                    children: [
                      Icon(Icons.calendar_today_outlined, color: Colors.grey, size: 28),
                      SizedBox(width: 14),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Tidak Ada Antrean Aktif',
                              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
                            ),
                            SizedBox(height: 2),
                            Text(
                              'Anda belum memiliki jadwal pendaftaran antrean untuk hari ini.',
                              style: TextStyle(fontSize: 11, color: Color(0xFF64748B)),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ],
            const SizedBox(height: 20),

            // Quick Actions & Data Modules Grid
            const Text('Layanan Pasien & Rekam Data', style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold)),
            const SizedBox(height: 10),
            GridView.count(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              crossAxisCount: 2,
              crossAxisSpacing: 12,
              mainAxisSpacing: 12,
              childAspectRatio: 1.35,
              children: [
                _buildActionCard(
                  Icons.history_edu_outlined,
                  'Riwayat Medis',
                  '${history.length} rekam kunjungan',
                  () => _showHistoryModal(history),
                ),
                _buildActionCard(
                  Icons.receipt_long_outlined,
                  'Tagihan & Klaim',
                  '${bills.length} invoice terbit',
                  () => _showBillsModal(bills),
                ),
                _buildActionCard(
                  Icons.calendar_month_outlined,
                  'Janji Temu',
                  '${appointments.length} registrasi poli',
                  () {
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        content: Text('Total ${appointments.length} jadwal janji temu terdaftar.'),
                        behavior: SnackBarBehavior.floating,
                      ),
                    );
                  },
                ),
                _buildActionCard(
                  Icons.medication_outlined,
                  'Resep & Obat',
                  'Depo farmasi terpadu',
                  () {
                    _showHistoryModal(history);
                  },
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildActionCard(IconData icon, String title, String subtitle, VoidCallback onTap) {
    return Card(
      elevation: 0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(14),
        side: const BorderSide(color: Color(0xFFE2E8F0)),
      ),
      color: Colors.white,
      child: InkWell(
        borderRadius: BorderRadius.circular(14),
        onTap: onTap,
        child: Padding(
          padding: const EdgeInsets.all(12.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(icon, color: const Color(0xFF0D9488), size: 26),
              const SizedBox(height: 8),
              Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
              const SizedBox(height: 2),
              Text(
                subtitle,
                style: const TextStyle(fontSize: 11, color: Color(0xFF64748B)),
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
              ),
            ],
          ),
        ),
      ),
    );
  }
}
