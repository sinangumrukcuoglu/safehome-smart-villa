import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { getPersons, getVitals, wsService } from '../services/api';

const MOCK_MEMBERS = [
  { id: '1', name: 'Dede', relation: 'Babaannem', room: 'Yatak Odası', avatar: '👴', status: 'Aktif', heartRate: 72, breathingRate: 14, health: 'normal' },
  { id: '2', name: 'Anne', relation: 'Eşim', room: 'Salon', avatar: '👩', status: 'Aktif', heartRate: 68, breathingRate: 16, health: 'normal' },
  { id: '3', name: 'Baba', relation: 'Ben', room: 'Yatak Odası', avatar: '👨', status: 'Aktif', heartRate: 75, breathingRate: 15, health: 'normal' },
];

export default function Health() {
  const [members, setMembers] = useState(MOCK_MEMBERS);
  const [refreshing, setRefreshing] = useState(false);
  const [useMock, setUseMock] = useState(false);

  const fetchHealth = useCallback(async () => {
    try {
      const res = await getVitals();
      if (res?.persons) {
        setMembers(prev => prev.map((m, i) => ({
          ...m,
          heartRate: res.persons[i]?.heart_rate || m.heartRate,
          breathingRate: res.persons[i]?.breathing_rate || m.breathingRate,
          status: res.persons[i]?.status === 'normal' ? 'Aktif' : 'Dikkat',
          health: res.persons[i]?.status || 'normal',
        })));
        setUseMock(false);
      }
    } catch (error) {
      console.error('Fetch health error:', error);
      setUseMock(true);
    }
  }, []);

  useEffect(() => {
    fetchHealth();
    
    // Subscribe to real-time health updates
    wsService.subscribe('health_update', (data) => {
      setMembers(prev => prev.map(m => 
        m.id === data.person_id 
          ? { 
              ...m, 
              heartRate: data.heart_rate, 
              breathingRate: data.breathing_rate,
              status: data.status === 'normal' ? 'Aktif' : 'Dikkat',
              health: data.status
            }
          : m
      ));
    });

    const interval = setInterval(fetchHealth, 5000);

    return () => {
      clearInterval(interval);
    };
  }, [fetchHealth]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchHealth().finally(() => setRefreshing(false));
  };

  const sendEmergencyAlert = () => {
    Alert.alert(
      '🚨 Acil Durum',
      'Tüm aile üyelerine acil durum bildirimi gönderilecek. Emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        { text: 'Gönder', style: 'destructive', onPress: () => Alert.alert('Bildirim Gönderildi', 'Acil durum bildirimi tüm üyelere iletildi.') },
      ]
    );
  };

  const getAvatarEmoji = (name) => {
    if (name.includes('Dede')) return '👴';
    if (name.includes('Anne')) return '👩';
    if (name.includes('Baba')) return '👨';
    return '👤';
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

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>👤 Aile Üyeleri</Text>
      </View>

      {/* Family Members */}
      {members.map((member) => (
        <View key={member.id} style={styles.memberCard}>
          <View style={styles.memberHeader}>
            <View style={styles.avatarContainer}>
              <Text style={styles.avatar}>{getAvatarEmoji(member.name)}</Text>
              <View style={[styles.statusDot, member.status === 'Aktif' && styles.statusActive]} />
            </View>
            <View style={styles.memberInfo}>
              <Text style={styles.memberName}>{member.name}</Text>
              <Text style={styles.memberRelation}>{member.relation} • {member.room}</Text>
            </View>
            <View style={[styles.healthBadge, member.health === 'normal' && styles.healthNormal]}>
              <Text style={styles.healthBadgeText}>
                {member.health === 'normal' ? '🟢 Normal' : '🔴 Dikkat'}
              </Text>
            </View>
          </View>

          {/* Vital Signs */}
          <View style={styles.vitalsRow}>
            <View style={styles.vitalCard}>
              <Text style={styles.vitalIcon}>💓</Text>
              <Text style={styles.vitalValue}>{member.heartRate || '--'}</Text>
              <Text style={styles.vitalLabel}>bpm</Text>
            </View>
            <View style={styles.vitalCard}>
              <Text style={styles.vitalIcon}>🫁</Text>
              <Text style={styles.vitalValue}>{member.breathingRate || '--'}</Text>
              <Text style={styles.vitalLabel}>/dk</Text>
            </View>
          </View>

          {/* Status */}
          <View style={styles.statusRow}>
            <Text style={styles.statusText}>Durum: {member.status}</Text>
            <Text style={styles.statusText}>Sağlık: {member.health}</Text>
          </View>
        </View>
      ))}

      {/* Weekly Stats */}
      <View style={styles.weeklySection}>
        <Text style={styles.sectionTitle}>📊 Haftalık Özet</Text>
        <View style={styles.weeklyCard}>
          <View style={styles.weeklyRow}>
            <Text style={styles.weeklyLabel}>Ort. Uyku</Text>
            <View style={styles.weeklyBar}>
              <View style={[styles.weeklyFill, { width: '75%' }]} />
            </View>
            <Text style={styles.weeklyValue}>7s 24dk</Text>
          </View>
          <View style={styles.weeklyRow}>
            <Text style={styles.weeklyLabel}>Ort. Hareket</Text>
            <View style={styles.weeklyBar}>
              <View style={[styles.weeklyFill, { width: '60%' }]} />
            </View>
            <Text style={styles.weeklyValue}>2.8s/s</Text>
          </View>
          <View style={styles.weeklyRow}>
            <Text style={styles.weeklyLabel}>Düşme Sayısı</Text>
            <View style={styles.weeklyBar}>
              <View style={[styles.weeklyFillGreen, { width: '0%' }]} />
            </View>
            <Text style={styles.weeklyValue}>0</Text>
          </View>
        </View>
      </View>

      {/* Emergency Button */}
      <TouchableOpacity style={styles.emergencyButton} onPress={sendEmergencyAlert}>
        <Text style={styles.emergencyIcon}>🆘</Text>
        <Text style={styles.emergencyText}>ACIL ARA</Text>
        <Text style={styles.emergencySubtext}>Tüm aile üyelerine bildirim</Text>
      </TouchableOpacity>
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
  header: {
    marginBottom: 16,
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  memberCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  memberHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    fontSize: 40,
  },
  statusDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#8E8E93',
    borderWidth: 2,
    borderColor: '#1C1C1E',
  },
  statusActive: {
    backgroundColor: '#34C759',
  },
  memberInfo: {
    flex: 1,
    marginLeft: 12,
  },
  memberName: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  memberRelation: {
    color: '#8E8E93',
    fontSize: 14,
  },
  healthBadge: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  healthNormal: {
    backgroundColor: '#34C759',
  },
  healthBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  vitalsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  vitalCard: {
    alignItems: 'center',
    backgroundColor: '#2C2C2E',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  vitalIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  vitalValue: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
  },
  vitalLabel: {
    color: '#8E8E93',
    fontSize: 14,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statusText: {
    color: '#8E8E93',
    fontSize: 14,
  },
  weeklySection: {
    marginBottom: 16,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  weeklyCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    padding: 16,
  },
  weeklyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  weeklyLabel: {
    color: '#8E8E93',
    fontSize: 14,
    width: 100,
  },
  weeklyBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#2C2C2E',
    borderRadius: 4,
    marginHorizontal: 12,
    overflow: 'hidden',
  },
  weeklyFill: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 4,
  },
  weeklyFillGreen: {
    height: '100%',
    backgroundColor: '#34C759',
    borderRadius: 4,
  },
  weeklyValue: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    width: 60,
    textAlign: 'right',
  },
  emergencyButton: {
    backgroundColor: '#FF3B30',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 32,
  },
  emergencyIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  emergencyText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  emergencySubtext: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    marginTop: 4,
  },
});
