import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Switch, Alert, RefreshControl } from 'react-native';
import { getAutomationRules, toggleRule, wsService } from '../services/api';

const SETTINGS_SECTIONS = [
  {
    title: '👤 Hesap',
    items: [
      { label: 'Profil Düzenle', type: 'navigation' },
      { label: 'Aile Üyeleri', type: 'navigation' },
      { label: 'Abonelik Paketi', type: 'info', value: 'Premium' },
    ],
  },
  {
    title: '🔔 Bildirimler',
    items: [
      { label: 'Push Bildirimler', type: 'switch', key: 'push_notifications', value: true },
      { label: 'SMS Uyarıları', type: 'switch', key: 'sms_alerts', value: false },
      { label: 'Düşme Uyarısı', type: 'switch', key: 'fall_alerts', value: true },
      { label: 'Hareket Uyarısı', type: 'switch', key: 'motion_alerts', value: true },
      { label: 'Günlük Özet', type: 'switch', key: 'daily_summary', value: true },
    ],
  },
  {
    title: '🏠 Ev Ayarları',
    items: [
      { label: 'Oda Düzenle', type: 'navigation' },
      { label: 'KNX Cihazları', type: 'navigation' },
      { label: 'WiFi Sensör Konumu', type: 'navigation' },
      { label: 'Acil Durum Kişileri', type: 'navigation' },
    ],
  },
  {
    title: '📊 Veri & Gizlilik',
    items: [
      { label: 'Veri Saklama', type: 'info', value: '30 gün' },
      { label: 'Konum Paylaşımı', type: 'switch', key: 'location_sharing', value: true },
      { label: 'Sağlık Verileri', type: 'switch', key: 'health_data', value: true },
      { label: 'Veri İndir', type: 'navigation' },
    ],
  },
  {
    title: '❓ Yardım & Destek',
    items: [
      { label: 'SSS', type: 'navigation' },
      { label: 'İletişim', type: 'navigation' },
      { label: 'Uygulama Hakkında', type: 'info', value: 'v1.0.0' },
    ],
  },
];

export default function Settings() {
  const [settings, setSettings] = useState({
    'push_notifications': true,
    'sms_alerts': false,
    'fall_alerts': true,
    'motion_alerts': true,
    'daily_summary': true,
    'location_sharing': true,
    'health_data': true,
  });
  
  const [automationRules, setAutomationRules] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [useMock, setUseMock] = useState(false);

  const fetchRules = useCallback(async () => {
    try {
      const res = await getAutomationRules();
      if (res?.rules) {
        setAutomationRules(res.rules);
        setUseMock(false);
      }
    } catch (error) {
      console.error('Fetch rules error:', error);
      setUseMock(true);
    }
  }, []);

  useEffect(() => {
    fetchRules();
    
    // Real-time rule updates
    wsService.subscribe('rule_update', (data) => {
      setAutomationRules(prev => prev.map(r => 
        r.id === data.rule_id ? { ...r, enabled: data.enabled } : r
      ));
    });
  }, [fetchRules]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchRules().finally(() => setRefreshing(false));
  };

  const toggleSetting = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleToggleRule = async (ruleId) => {
    try {
      const res = await toggleRule(ruleId);
      if (res?.success) {
        setAutomationRules(prev => prev.map(r => 
          r.id === ruleId ? { ...r, enabled: res.enabled } : r
        ));
      }
    } catch (error) {
      console.error('Toggle rule error:', error);
      Alert.alert('Hata', 'Kural güncellenemedi');
    }
  };

  const handleLogout = () => {
    Alert.alert(
      '🚪 Çıkış Yap',
      'Hesabınızdan çıkış yapmak istediğinize emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        { text: 'Çıkış Yap', style: 'destructive', onPress: () => Alert.alert('Çıkış Yapıldı') },
      ]
    );
  };

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {/* Connection Status */}
      <View style={useMock ? styles.mockWarning : styles.apiStatus}>
        <Text style={useMock ? styles.mockText : styles.apiText}>
          {useMock ? '⚠️ Backend Bağlı Değil' : '✅ Backend Bağlı'}
        </Text>
      </View>

      {/* Automation Rules */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>⚡ Otomasyon Kuralları</Text>
        <View style={styles.sectionCard}>
          {automationRules.map((rule, index) => (
            <TouchableOpacity
              key={rule.id}
              style={[
                styles.ruleItem,
                index < automationRules.length - 1 && styles.ruleItemBorder
              ]}
            >
              <View style={styles.ruleInfo}>
                <Text style={styles.ruleName}>{rule.name}</Text>
                <Text style={styles.ruleDesc}>{rule.description}</Text>
              </View>
              <Switch
                value={rule.enabled}
                onValueChange={() => handleToggleRule(rule.id)}
                trackColor={{ false: '#39393D', true: '#34C759' }}
                thumbColor="white"
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Settings Sections */}
      {SETTINGS_SECTIONS.map((section, sectionIndex) => (
        <View key={sectionIndex} style={styles.section}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          <View style={styles.sectionCard}>
            {section.items.map((item, itemIndex) => (
              <TouchableOpacity
                key={itemIndex}
                style={[
                  styles.settingItem,
                  itemIndex < section.items.length - 1 && styles.settingItemBorder
                ]}
                onPress={() => item.type === 'navigation' && Alert.alert(item.label, 'Bu özellik henüz aktif değil.')}
                disabled={item.type === 'switch' || item.type === 'info'}
              >
                <Text style={styles.settingLabel}>{item.label}</Text>
                
                {item.type === 'switch' && (
                  <Switch
                    value={settings[item.key]}
                    onValueChange={() => toggleSetting(item.key)}
                    trackColor={{ false: '#39393D', true: '#34C759' }}
                    thumbColor="white"
                  />
                )}
                
                {item.type === 'info' && (
                  <View style={styles.infoContainer}>
                    <Text style={styles.infoValue}>{item.value}</Text>
                    <Text style={styles.chevron}>›</Text>
                  </View>
                )}
                
                {item.type === 'navigation' && (
                  <Text style={styles.chevron}>›</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ))}

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>🚪 Çıkış Yap</Text>
      </TouchableOpacity>

      {/* App Info */}
      <View style={styles.appInfo}>
        <Text style={styles.appName}>SafeHome Smart Villa</Text>
        <Text style={styles.appVersion}>Versiyon 1.0.0</Text>
        <Text style={styles.appPowered}>Powered by WiFi DensePose (MIT)</Text>
      </View>
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: '#8E8E93',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    marginLeft: 4,
    textTransform: 'uppercase',
  },
  sectionCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    overflow: 'hidden',
  },
  ruleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    minHeight: 50,
  },
  ruleItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#2C2C2E',
  },
  ruleInfo: {
    flex: 1,
    marginRight: 12,
  },
  ruleName: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  ruleDesc: {
    color: '#8E8E93',
    fontSize: 12,
    marginTop: 2,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    minHeight: 50,
  },
  settingItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#2C2C2E',
  },
  settingLabel: {
    color: 'white',
    fontSize: 16,
    flex: 1,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoValue: {
    color: '#8E8E93',
    fontSize: 16,
    marginRight: 8,
  },
  chevron: {
    color: '#8E8E93',
    fontSize: 24,
    fontWeight: '300',
  },
  logoutButton: {
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  logoutText: {
    color: '#FF3B30',
    fontSize: 16,
    fontWeight: '600',
  },
  appInfo: {
    alignItems: 'center',
    marginBottom: 32,
  },
  appName: {
    color: '#8E8E93',
    fontSize: 14,
    fontWeight: '600',
  },
  appVersion: {
    color: '#8E8E93',
    fontSize: 12,
    marginTop: 4,
  },
  appPowered: {
    color: '#555',
    fontSize: 10,
    marginTop: 8,
  },
});
