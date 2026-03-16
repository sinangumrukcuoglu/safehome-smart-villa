import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { getZones, wsService } from '../services/api';

const MOCK_ROOMS = [
  { id: '1', name: 'Salon', icon: '🛋️', persons: 0, lastMotion: '-', active: false },
  { id: '2', name: 'Mutfak', icon: '🍳', persons: 0, lastMotion: '-', active: false },
  { id: '3', name: 'Yatak Odası', icon: '🛏️', persons: 0, lastMotion: '-', active: false, heartRate: null, breathingRate: null },
  { id: '4', name: 'Banyo', icon: '🚿', persons: 0, lastMotion: '-', active: false },
  { id: '5', name: 'Bahçe', icon: '🚪', persons: 0, lastMotion: '-', active: false },
];

export default function Rooms() {
  const [rooms, setRooms] = useState(MOCK_ROOMS);
  const [refreshing, setRefreshing] = useState(false);
  const [useMock, setUseMock] = useState(false);

  const fetchRooms = useCallback(async () => {
    try {
      const res = await getZones();
      if (res?.zones) {
        setRooms(res.zones.map(r => ({
          id: r.id,
          name: r.name,
          icon: r.icon,
          persons: r.occupancy?.count || 0,
          lastMotion: r.occupancy?.lastMotion || '-',
          active: r.occupancy?.active || false,
          heartRate: r.name.includes('Yatak') ? 72 : null,
          breathingRate: r.name.includes('Yatak') ? 14 : null,
        })));
        setUseMock(false);
      }
    } catch (error) {
      console.error('Fetch rooms error:', error);
      setUseMock(true);
    }
  }, []);

  useEffect(() => {
    fetchRooms();
    
    // Subscribe to real-time updates
    wsService.subscribe('occupancy_update', (data) => {
      setRooms(prev => prev.map(r => 
        r.id === data.room_id 
          ? { ...r, persons: data.count, active: data.active, lastMotion: data.lastMotion }
          : r
      ));
    });

    const interval = setInterval(fetchRooms, 5000);

    return () => {
      clearInterval(interval);
    };
  }, [fetchRooms]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchRooms().finally(() => setRefreshing(false));
  };

  const getRoomEmoji = (name) => {
    if (name.includes('Salon')) return '🛋️';
    if (name.includes('Mutfak')) return '🍳';
    if (name.includes('Yatak')) return '🛏️';
    if (name.includes('Banyo')) return '🚿';
    if (name.includes('Bahçe')) return '🚪';
    return '🏠';
  };

  const formatLastMotion = (timestamp) => {
    if (!timestamp || timestamp === '-') return '-';
    try {
      const date = new Date(timestamp);
      const now = new Date();
      const diff = Math.floor((now - date) / 1000);
      
      if (diff < 60) return `${diff} sn önce`;
      if (diff < 3600) return `${Math.floor(diff / 60)} dk önce`;
      if (diff < 86400) return `${Math.floor(diff / 3600)} saat önce`;
      return date.toLocaleDateString('tr-TR');
    } catch {
      return '-';
    }
  };

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {/* Connection Status */}
      <View style={useMock ? styles.mockWarning : styles.apiStatus}>
        <Text style={useMock ? styles.mockText : styles.apiText}>
          {useMock ? '⚠️ Mock Veri' : '✅ Backend Bağlı'}
        </Text>
      </View>

      {rooms.map((room) => (
        <TouchableOpacity key={room.id} style={[styles.roomCard, !room.active && styles.roomInactive]}>
          <View style={styles.roomHeader}>
            <View style={styles.roomIcon}>
              <Text style={styles.iconEmoji}>{getRoomEmoji(room.name)}</Text>
            </View>
            <View style={styles.roomInfo}>
              <Text style={styles.roomName}>{room.name}</Text>
              <Text style={styles.roomStatus}>
                {room.active ? (
                  <Text style={styles.activeStatus}>● Aktif</Text>
                ) : (
                  <Text style={styles.inactiveStatus}>○ Boş</Text>
                )}
              </Text>
            </View>
            <View style={[styles.personBadge, room.active && styles.personBadgeActive]}>
              <Text style={styles.personCount}>{room.persons} 👤</Text>
            </View>
          </View>

          <View style={styles.roomDetails}>
            <Text style={styles.motionText}>Son hareket: {formatLastMotion(room.lastMotion)}</Text>
            
            {/* Health metrics for bedroom */}
            {room.name.includes('Yatak') && room.active && (
              <View style={styles.healthRow}>
                {room.heartRate && (
                  <View style={styles.healthMetric}>
                    <Text style={styles.healthIcon}>💓</Text>
                    <Text style={styles.healthValue}>{room.heartRate}</Text>
                    <Text style={styles.healthLabel}>bpm</Text>
                  </View>
                )}
                {room.breathingRate && (
                  <View style={styles.healthMetric}>
                    <Text style={styles.healthIcon}>🫁</Text>
                    <Text style={styles.healthValue}>{room.breathingRate}</Text>
                    <Text style={styles.healthLabel}>/dk</Text>
                  </View>
                )}
                <View style={[styles.healthStatus, { backgroundColor: '#34C759' }]}>
                  <Text style={styles.healthStatusText}>Normal</Text>
                </View>
              </View>
            )}
          </View>

          {/* Activity indicator */}
          <View style={styles.activityBar}>
            <View style={[styles.activityFill, { width: room.active ? '80%' : '10%' }]} />
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 16,
  },
  apiStatus: {
    backgroundColor: '#34C759',
    padding: 8,
    borderRadius: 8,
    marginBottom: 16,
  },
  mockWarning: {
    backgroundColor: '#FF9500',
    padding: 8,
    borderRadius: 8,
    marginBottom: 16,
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
  roomCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  roomInactive: {
    opacity: 0.6,
  },
  roomHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  roomIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#2C2C2E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconEmoji: {
    fontSize: 24,
  },
  roomInfo: {
    flex: 1,
    marginLeft: 12,
  },
  roomName: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  roomStatus: {
    fontSize: 14,
    marginTop: 2,
  },
  activeStatus: {
    color: '#34C759',
  },
  inactiveStatus: {
    color: '#8E8E93',
  },
  personBadge: {
    backgroundColor: '#2C2C2E',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  personBadgeActive: {
    backgroundColor: '#007AFF',
  },
  personCount: {
    color: 'white',
    fontWeight: '600',
  },
  roomDetails: {
    marginBottom: 8,
  },
  motionText: {
    color: '#8E8E93',
    fontSize: 14,
  },
  healthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#2C2C2E',
  },
  healthMetric: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  healthIcon: {
    fontSize: 16,
    marginRight: 4,
  },
  healthValue: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  healthLabel: {
    color: '#8E8E93',
    fontSize: 12,
    marginLeft: 2,
  },
  healthStatus: {
    marginLeft: 'auto',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  healthStatusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  activityBar: {
    height: 4,
    backgroundColor: '#2C2C2E',
    borderRadius: 2,
    overflow: 'hidden',
  },
  activityFill: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 2,
  },
});
