import React, { useState } from 'react';
import { View, StyleSheet, Text, Platform, Modal, Alert, Pressable, TextInput } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { WebView } from 'react-native-webview';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { useRouteInfo, useRouter } from 'expo-router/build/hooks';
import { useAsyncStorage } from '../../../hooks/useAsyncStorage';

interface Leader {
  name: string
  score: number
}

const FinishPage = () => {

  const route = useRouteInfo()
  const router = useRouter()
  const androidPath = 'file:///android_asset/finishPage/index.html';
  const leaderBoard = useAsyncStorage<Leader[]>('leaderBoard', [])
  const [modalVisible, setModalVisible] = useState(false);
  const [viewVisible, setViewVisible] = useState(true);
  const [name, setName] = useState('');
  const onNavigate = () => {
    setViewVisible(false)
    if (name.length === 0) {
      setName('Безымянный')
    }
    const score = typeof route.params.score === 'string' ? route.params.score : '0'
    const newLeader: Leader = { name, score: Number.parseInt(score) };
    const currentList = leaderBoard.data || [];
    const newList = [...currentList, newLeader]
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
    leaderBoard.setData(newList);
    router.push('/')
  }
  const ModalClose = () => {
    setModalVisible(!modalVisible)
    onNavigate()
  }
  return (<>
    <View style={{ flex: 1, display: viewVisible ? 'block' : 'none' }} >

      <WebView
        source={{ uri: androidPath }}
        style={styles.webview}
        originWhitelist={['*']}
        scrollEnabled={false}
        overScrollMode='never'
        pointerEvents="none"
      />
      <View style={styles.overlay}>
        <Text style={styles.title} >Ваш результат</Text>
        <LinearGradient
          colors={['#C5291D', '#8F2017', '#CF341E']}
          style={styles.card}>
          <Text style={styles.text}>{`${route.params.score}/${route.params.scores}`}</Text>
        </LinearGradient>
        <Text style={styles.title}>Сохранить?</Text>
        <View style={styles.buttonBox}>
          <Pressable onPress={() => setModalVisible(!modalVisible)}
            style={styles.button}
          >
            <LinearGradient
              colors={['#C5291D', '#8F2017', '#CF341E']}
              style={styles.button}
            >
              <Text style={styles.buttonText}>Да</Text>
            </LinearGradient>
          </Pressable>
          <Pressable onPress={onNavigate}>
            <LinearGradient
              colors={['#C5291D', '#8F2017', '#CF341E']}
              style={styles.button}>
              <Text style={styles.buttonText}>Нет</Text>
            </LinearGradient>
          </Pressable>
        </View>
      </View>
    </View>
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalTextModal}>Введите свое имя!</Text>
          <TextInput
            maxLength={20}
            onChangeText={setName}
            style={styles.input}
            value={name}
            placeholder="Имя"
          />
          <View style={styles.buttonBox2}>
            <Pressable
              style={[styles.buttonModal, styles.buttonCloseModal]}
              onPress={() => setModalVisible(!modalVisible)}>
              <Text style={styles.textStyleModal}>Отмена</Text>
            </Pressable>
            <Pressable
              style={[styles.buttonModal, styles.buttonCloseModal]}
              onPress={ModalClose}>
              <Text style={styles.textStyleModal}>Сохранить</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  </>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 45,
    width: '100%',
    minWidth: '100%',
    margin: 12,
    borderWidth: 1,
    padding: 5,
    fontSize: 30
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    width: '30%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonModal: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpenModal: {
    backgroundColor: '#F194FF',
  },
  buttonCloseModal: {
    backgroundColor: '#2196F3',
  },
  textStyleModal: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 30

  },
  modalTextModal: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 30
  },
  webview: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
    elevation: 0,
    shadowOpacity: 0,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    gap: 20,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 60,
    fontWeight: 'bold',
    color: '#fff',
  },
  text: {
    fontSize: 100,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  card: {
    width: 600,
    maxWidth: 820,
    height: 200,
    maxHeight: 230,
    borderRadius: 15,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonBox: {
    display: 'flex',
    flexDirection: "row",
    gap: 60,
  },
  buttonBox2: {
    display: 'flex',
    flexDirection: "row",
    gap: 20,
  },
  button: {
    width: 270,
    maxWidth: 270,
    height: 150,
    maxHeight: 150,
    borderRadius: 15,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 70,
    fontWeight: 'bold',
    color: '#FFFFFF',
  }
});

export default FinishPage;
