import 'package:flutter/material.dart';

class NakesDashboardScreen extends StatelessWidget {
  const NakesDashboardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    const primaryTeal = Color(0xFF0D9488);
    const darkNavy = Color(0xFF0D1B2E);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Portal Tenaga Medis SIMRS', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
        actions: [
          IconButton(
            icon: const Icon(Icons.logout_rounded),
            onPressed: () => Navigator.of(context).pushReplacementNamed('/login'),
          )
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Doctor Profile & Active Clinic Shift Card
            Card(
              elevation: 0,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(16),
                side: const BorderSide(color: Color(0xFFE2E8F0)),
              ),
              color: Colors.white,
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Row(
                  children: [
                    CircleAvatar(
                      radius: 28,
                      backgroundColor: darkNavy.withOpacity(0.1),
                      child: const Icon(Icons.medical_services, color: darkNavy, size: 28),
                    ),
                    const SizedBox(width: 16),
                    const Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('dr. Ratna Anindita, Sp.PD', style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold)),
                          SizedBox(height: 2),
                          Text('Spesialis Penyakit Dalam · SIP: 503/SIP.DOK/00231', style: TextStyle(fontSize: 11, color: Color(0xFF64748B))),
                          SizedBox(height: 6),
                          Row(
                            children: [
                              Icon(Icons.access_time_filled, size: 13, color: primaryTeal),
                              SizedBox(width: 4),
                              Text('Jadwal Jaga: 09:00 - 14:00 WIB', style: TextStyle(fontSize: 11, color: primaryTeal, fontWeight: FontWeight.bold)),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 18),

            // Metrics Bar
            Row(
              children: [
                _buildMetricBox('18', 'Antrean Poli', primaryTeal),
                const SizedBox(width: 10),
                _buildMetricBox('6', 'Selesai EMR', Colors.indigo),
                const SizedBox(width: 10),
                _buildMetricBox('3', 'Order Lab Pending', Colors.amber.shade800),
              ],
            ),
            const SizedBox(height: 22),

            // Current Patient Queue
            const Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text('Daftar Pasien Menunggu', style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold)),
                Text('Real-Time', style: TextStyle(fontSize: 11, color: primaryTeal, fontWeight: FontWeight.bold)),
              ],
            ),
            const SizedBox(height: 10),

            _buildPatientQueueTile('INT-001', 'Budi Santoso', 'RM-002482', 'Kontrol GDP & Hipertensi', 'Sedang Diperiksa', primaryTeal),
            const SizedBox(height: 8),
            _buildPatientQueueTile('INT-002', 'Dewi Lestari', 'RM-002483', 'Nyeri lambung akut', 'Menunggu Dipanggil', Colors.orange),
            const SizedBox(height: 8),
            _buildPatientQueueTile('INT-003', 'Ahmad Fauzi', 'RM-002484', 'Cek laboratorium rutin', 'Menunggu Dipanggil', Colors.orange),
          ],
        ),
      ),
    );
  }

  Widget _buildMetricBox(String count, String label, Color color) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 10),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(12),
          border: BorderSide(color: const Color(0xFFE2E8F0)),
        ),
        child: Column(
          children: [
            Text(count, style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: color)),
            const SizedBox(height: 4),
            Text(label, style: const TextStyle(fontSize: 10, color: Color(0xFF64748B)), textAlign: TextAlign.center),
          ],
        ),
      ),
    );
  }

  Widget _buildPatientQueueTile(String queueNo, String name, String rm, String complaint, String status, Color statusColor) {
    return Card(
      elevation: 0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
        side: const BorderSide(color: Color(0xFFE2E8F0)),
      ),
      child: ListTile(
        leading: Container(
          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
          decoration: BoxDecoration(
            color: const Color(0xFFF1F5F9),
            borderRadius: BorderRadius.circular(8),
          ),
          child: Text(queueNo, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Color(0xFF0F172A))),
        ),
        title: Text(name, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
        subtitle: Text('$rm · $complaint', style: const TextStyle(fontSize: 11, color: Color(0xFF64748B))),
        trailing: Chip(
          label: Text(status, style: TextStyle(fontSize: 9.5, color: statusColor, fontWeight: FontWeight.bold)),
          backgroundColor: statusColor.withOpacity(0.1),
          padding: EdgeInsets.zero,
          materialTapTargetSize: MaterialTapTargetSize.shrinkWrap,
        ),
      ),
    );
  }
}
