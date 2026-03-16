import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { getZones, getStats, getAlerts, wsService } from '../services/api';

const MOCK_DATA = {
  villa: { name: 'Villa #A5', status: 'Aktif', totalPersons: 0 },
  rooms: [],
  energy: { current: 0, lastMonth: 0, unit: 'kWh' },
  alerts: [],
};

export default function Dashboard() {
  const [data, setData] = useState(MOCK_DATA);
  const [refreshing, setRefreshing] = useState(false);
  const [useMock, setUseMock] = useState(false);

  const fetchData = useCallback(async () => {
    if (useMock) return;

    try {
      // Fetch zones
      const zonesRes = await getZones();
      const zonesData = zonesRes?.zones || [];
      
      // Fetch stats
      const statsRes = await getStats();
      const statsData = statsRes || {};
      
      // Fetch alerts
      const alertsRes = await getAlerts();
      const alertsData = alertsRes?.alerts || [];

      setData({
        villa: {
          name: 'Villa #A5',
          status: 'Aktif',
          totalPersons: zonesData.reduce((sum, z) => sum + (z.occupancy?.count || 0), 0),
        },
        rooms: zonesData.map(r => ({
          id: r.id,
          name: r.name,
          icon: r.icon,
          persons: r.occupancy?.count || 0,
          lastMotion: r.occupancy?.lastMotion || 'Bilgi yok',
          active: r.occupancy?.active || false,
        })),
        energy: {
          current: statsData.energy?.current_month || 0,
          lastMonth: statsData.energy?.last_month || 0,
          unit: 'kWh',
        },
        alerts: alertsData.slice(0, 5).map(a => ({
          id: a.id,
          type: a.type,
          message: a.message,
          room: a.room_id,
          time: new Date(a.timestamp).toLocaleTimeString('tr-TR'),
          severity: a.severity,
        })),
      });
    } catch (error) {
      console.error('Fetch error:', error);
      // Fall back to mock data if API fails
      setUseMock(true);
    }
  }, [useMock]);

  useEffect(() => {
    fetchData();
    
    // Connect WebSocket for real-time updates
    wsService.connect().catch(err => {
      console.log('WS connection failed, using polling');
      setUseMock(true);
    });

    // Subscribe to updates
    wsService.subscribe('occupancy_update', (data) => {
      setData(prev => ({
        ...prev,
        rooms: prev.rooms.map(r => 
          r.id === data.room_id 
            ? { ...r, persons: data.count, active: data.active }
            : r
        ),
        villa: {
          ...prev.villa,
          totalPersons: prev.rooms.reduce((sum, r) => sum + (r.id === data.room_id ? data.count : r.persons), 0),
        },
      }));
    });

    wsService.subscribe('new_alert', (data) => {
      setData(prev => ({
        ...prev,
        alerts: [data.alert, ...prev.alerts].slice(0, 5),
      }));
    });

    // Auto-refresh every 5 seconds
    const interval = setInterval(fetchData, 5000);

    return () => {
      clearInterval(interval);
      wsService.disconnect();
    };
  }, [fetchData]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData().finally(() => setRefreshing(false));
  };

  const getAlertColor = (severity) => {
    switch (severity) {
      case 'critical': return '#FF3B30';
      case 'warning': return '#FF9500';
      case 'info': return '#007AFF';
      default: return '#8E8E93';
    }
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case 'fall': return '⚠️';
      case 'motion': return '👀';
      case 'security': return '🔒';
      default: return '🔔';
    }
  };

  const getRoomEmoji = (name) => {
    if (name.includes('Salon')) return '🛋️';
    if (name.includes('Mutfak')) return '🍳';
    if (name.includes('Yatak')) return '🛏️';
    if (name.includes('Banyo')) return '🚿';
    if (name.includes('Bahçe')) return '🚪';
    return '🏠';
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {/* API Status */}
      <View style={useMock ? styles.mockWarning : styles.apiStatus}>
        <Text style={useMock ? styles.mockText : styles.apiText}>
          {useMock ? '⚠️ Mock Veri (API bağlantısı yok)' : '✅ API Bağlı'}
        </Text>
      </View>

      {/* Villa Durumu */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🏠 Villa Durumu</Text>
        <View style={styles.statusCard}>
          <View style={styles.statusRow}>
            <View style={styles.statusItem}>
              <Text style={styles.statusLabel}>Durum</Text>
              <View style={styles.statusBadge}>
                <View style={[styles.statusDot, { backgroundColor: '#34C759' }]} />
                <Text style={styles.statusValue}>{data.villa.status}</Text>
              </View>
            </View>
            <View style={styles.statusItem}>
              <Text style={styles.statusLabel}>Kişi Sayısı</Text>
              <Text style={styles.statusValueLarge}>{data.villa.totalPersons} 👤</Text>
            </View>
          </View>

          {/* Room Icons */}
          <View style={styles.roomRow}>
            {data.rooms.slice(0, 3).map((room) => (
              <TouchableOpacity key={room.id} style={styles.roomIcon}>
                <View style={[styles.roomCircle, room.active && styles.roomActive]}>
                  <Text style={styles.roomEmoji}>{getRoomEmoji(room.name)}</Text>
                </View>
                <Text style={styles.roomName}>{room.name.split(' ')[0]}</Text>
                <Text style={styles.roomCount}>{room.persons} kişi</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      {/* Enerji */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>⚡ Enerji (Bu Ay)</Text>
        <View style={styles.energyCard}>
          <View style={styles.energyBar}>
            <View style={[styles.energyFill, { width: `${Math.min((data.energy.current / 400) * 100, 100)}%` }]} />
          </View>
          <View style={styles.energyInfo}>
            <Text style={styles.energyCurrent}>{data.energy.current} {data.energy.unit}</Text>
            <Text style={styles.energyLast}>Geçen ay: {data.energy.lastMonth} {data.energy.unit}</Text>
          </View>
        </View>
      </View>

      {/* Bildirimler */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🚨 Son Bildirimler</Text>
        <View style={styles.alertsCard}>
          {data.alerts.length === 0 ? (
            <View style={styles.emptyAlerts}>
              <Text style={styles.emptyText}>Bildirim yok ✓</Text>
            </View>
          ) : (
            data.alerts.map((alert) => (
              <TouchableOpacity key={alert.id} style={styles.alertItem}>
                <View style={[styles.alertIndicator, { backgroundColor: getAlertColor(alert.severity) }]} />
                <Text style={styles.alertIcon}>{getAlertIcon(alert.type)}</Text>
                <View style={styles.alertContent}>
                  <Text style={styles.alertMessage}>{alert.message}</Text>
                  <Text style={styles.alertRoom}>{alert.room} • {alert.time}</Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  apiStatus: {
    backgroundColor: '#34C759',
    padding: 8,
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 8,
  },
  mockWarning: {
    backgroundColor: '#FF9500',
    padding: 8,
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 8,
  },
  apiText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '600',
  },
  mockText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '600',
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  statusCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    padding: 16,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statusItem: {
    flex: 1,
  },
  statusLabel: {
    color: '#8E8E93',
    fontSize: 12,
    marginBottom: 4,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusValue: {
    color: '#34C759',
    fontSize: 14,
    fontWeight: '600',
  },
  statusValueLarge: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
  },
  roomRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  roomIcon: {
    alignItems: 'center',
  },
  roomCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#2C2C2E',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  roomActive: {
    backgroundColor: '#007AFF',
  },
  roomEmoji: {
    fontSize: 24,
  },
  roomName: {
    color: '#8E8E93',
    fontSize: 12,
    marginBottom: 2,
  },
  roomCount: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  energyCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    padding: 16,
  },
  energyBar: {
    height: 8,
    backgroundColor: '#2C2C2E',
    borderRadius: 4,
    marginBottom: 12,
    overflow: 'hidden',
  },
  energyFill: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 4,
  },
  energyInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  energyCurrent: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  energyLast: {
    color: '#8E8E93',
    fontSize: 14,
  },
  alertsCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    overflow: 'hidden',
  },
  emptyAlerts: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    color: '#34C759',
    fontSize: 16,
  },
  alertItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2C2C2E',
  },
  alertIndicator: {
    width: 4,
    height: '100%',
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
  },
  alertIcon: {
    fontSize: 20,
    marginRight: 12,
    marginLeft: 8,
  },
  alertContent: {
    flex: 1,
  },
  alertMessage: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  alertRoom: {
    color: '#8E8E93',
    fontSize: 14,
    marginTop: 2,
  },
});
